import { AuthUser } from '../types/express';

import { STORAGE_FOLDERS } from '../constants/storage-folders';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '../constants/audit.constants';

import * as auditLogService from './audit-log.service';
import * as storageService from '../integrations/storage/storage.service';
import { UploadedFile } from '../integrations/storage/storage.types';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as alumnoRepository from '../repositories/alumno.repository';
import * as empresaRepository from '../repositories/empresa.repository';
import * as rolEmpresaRepository from '../repositories/rol-empresa.repository';
import * as invitacionRepository from '../repositories/invitacion.repository';
import * as transactionRepository from '../repositories/transaction.repository';

import {
  ActualizarEmpresaDTO,
  AgregarParticipantesDTO,
  CrearEmpresaDTO,
  ModificarRolesDTO,
} from '../validators/empresa.validator';
import { CrearInvitacionesDTO } from '../validators/invitacion.validator';

import { InvitacionDTO } from '../dto/invitacion/inv-crear.dto';
import { toEmpresaActualResponse } from '../dto/empresa/emp.mapper';
import { toCandidatoResponse } from '../dto/alumno/alu.mapper';

import { ConflictError } from '../errors/conflict.error';
import { ForbiddenError } from '../errors/forbidden.error';
import { NotFoundError } from '../errors/not-found.error';
import { BadRequestError } from '../errors/bad-request-error';

import { generarTokenInvitacion } from '../utils/token.util';
import { obtenerFechaExpiracionInvitacion } from '../utils/date.util';

import { sendInvitationEmail } from '../integrations/email/email.service';

export async function crearEmpresa(
  user: AuthUser,
  data: CrearEmpresaDTO,
  logo?: Express.Multer.File
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithRolEmpresaOrThrow(user.keycloakId);
  const alumno = usuario.alumno;

  if (!alumno) {
    throw new ConflictError('Debes completar el registro de alumno antes de crear una empresa.');
  }

  if (alumno.idEmpresa) {
    throw new ConflictError('Ya perteneces a una empresa.', {
      empresaId: alumno.idEmpresa,
    });
  }

  if (alumno.rolEmpresa?.nombreRol !== 'CEO') {
    throw new ForbiddenError('Solo un Director Ejecutivo puede crear una empresa.', {
      requiredRole: 'CEO',
      currentRole: alumno.rolEmpresa?.nombreRol ?? null,
    });
  }

  const empresaExistente = await empresaRepository.findBynombre(data.nombre);

  if (empresaExistente) {
    throw new ConflictError('Ya existe una empresa con ese nombre.', {
      nombre: data.nombre,
    });
  }

  let uploaded: UploadedFile | undefined;

  try {
    if (logo) {
      uploaded = await storageService.upload(logo, STORAGE_FOLDERS.EMPRESAS);
    }

    return transactionRepository.ejecutarTransaccion(async (tx) => {
      const empresaCreada = await empresaRepository.create(
        {
          ...data,
          logoUrl: uploaded?.url ?? null,
          logoPublicId: uploaded?.publicId ?? null,
        },
        alumno.idCurso,
        1, //REVISAR CUANDO ESTÉ CICLO LECTIVO
        usuario.id,
        tx
      );

      await auditLogService.registrarAccion({
        tx,
        usuarioId: usuario.id,
        action: AUDIT_ACTIONS.CREATE,
        entity: AUDIT_ENTITIES.EMPRESA,
        entityId: empresaCreada.id,
        empresaId: empresaCreada.id,
        newValues: empresaCreada,
        description: 'Se creó una nueva empresa',
      });

      return empresaCreada;
    });
  } catch (error) {
    if (uploaded) {
      await storageService.deleteFile(uploaded.publicId);
    }

    throw error;
  }
}

export async function getEmpresaActual(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError(
      'Debes completar tu registro como alumno para acceder a la información de tu empresa.'
    );
  }

  if (!usuario.alumno.empresa) {
    return null;
  }

  return toEmpresaActualResponse(usuario.alumno.empresa);
}

export async function actualizarEmpresa(
  user: AuthUser,
  data: ActualizarEmpresaDTO,
  logo?: Express.Multer.File
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('Debes completar tu registro antes de actualizar una empresa.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  const empresa = usuario.alumno.empresa;
  if (empresa.nombre !== data.nombre) {
    const empresaExistente = await empresaRepository.findBynombre(data.nombre);

    if (empresaExistente) {
      throw new ConflictError('Ya existe una empresa con ese nombre.', {
        nombre: data.nombre,
      });
    }
  }

  if (logo && data.eliminarLogo) {
    throw new BadRequestError('No puedes reemplazar y eliminar el logo al mismo tiempo.');
  }

  let logoUrl = empresa.logoUrl;
  let logoPublicId = empresa.logoPublicId;

  let uploaded: UploadedFile | undefined;

  try {
    if (logo) {
      uploaded = await storageService.upload(logo, STORAGE_FOLDERS.EMPRESAS);

      logoUrl = uploaded.url;
      logoPublicId = uploaded.publicId;
    }

    if (data.eliminarLogo) {
      logoUrl = null;
      logoPublicId = null;
    }

    await transactionRepository.ejecutarTransaccion(async (tx) => {
      const empresaActualizada = await empresaRepository.update(
        empresa.id,
        {
          ...data,
          logoUrl,
          logoPublicId,
        },
        tx
      );

      await auditLogService.registrarAccion({
        tx,
        usuarioId: usuario.id,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.EMPRESA,
        entityId: empresa.id,
        empresaId: empresa.id,
        oldValues: empresa,
        newValues: empresaActualizada,
        description: 'Actualización de datos de la empresa',
      });
    });

    if (logo && empresa.logoPublicId) {
      await storageService.deleteFile(empresa.logoPublicId);
    }

    if (data.eliminarLogo && empresa.logoPublicId) {
      await storageService.deleteFile(empresa.logoPublicId);
    }

    return getEmpresaActual(user);
  } catch (error) {
    if (uploaded) {
      await storageService.deleteFile(uploaded.publicId);
    }

    throw error;
  }
}

export async function getCandidatos(user: AuthUser, search?: string) {
  const usuario = await usuarioRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('Debes completar tu registro antes de obtener candidatos.');
  }

  const alumnos = await alumnoRepository.findCandidatos(usuario.alumno.idCurso, usuario.id, search);

  return alumnos.map(toCandidatoResponse);
}

export async function agregarParticipantes(user: AuthUser, data: AgregarParticipantesDTO) {
  const ids = [...new Set(data.participantes)];
  if (ids.length !== data.participantes.length) {
    throw new ConflictError('La lista de participantes contiene elementos duplicados');
  }

  const usuario = await usuarioRepository.findByKeycloakIdWithRolEmpresaOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('Debes completar tu registro antes de agregar participantes.');
  }

  if (!usuario.alumno.idEmpresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  if (usuario.alumno.rolEmpresa?.nombreRol !== 'CEO') {
    throw new ForbiddenError('Solo un Director Ejecutivo (CEO) puede agregar participantes');
  }

  const alumnos = await alumnoRepository.findByIds(ids);

  if (alumnos.length !== ids.length) {
    throw new NotFoundError('Uno o más alumnos no existen');
  }

  for (const alumno of alumnos) {
    if (alumno.id === usuario.alumno.id) {
      throw new ConflictError('No puedes agregarte a ti mismo como participante.');
    }

    if (alumno.idCurso !== usuario.alumno.idCurso) {
      throw new ConflictError('Todos los participantes deben pertenecer al mismo curso.');
    }

    if (alumno.idEmpresa) {
      throw new ConflictError('Uno o más alumnos ya pertenecen a una empresa');
    }

    if (alumno.rolEmpresa?.nombreRol === 'CEO') {
      throw new ConflictError('No es posible agregar un Director Ejecutivo a una empresa.');
    }
  }

  await transactionRepository.ejecutarTransaccion(async (tx) => {
    await alumnoRepository.agregarAEmpresa(ids, usuario.alumno!.idEmpresa!, tx);

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.EMPRESA,
      entityId: usuario.alumno!.idEmpresa!,
      empresaId: usuario.alumno!.idEmpresa!,
      newValues: { idsAgregados: ids },
      description: 'Se agregaron participantes a la empresa',
    });
  });
}

export async function cambiarRolParticipante(
  user: AuthUser,
  idAlumno: string,
  idRolEmpresa: number
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithRolEmpresaOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('Debes completar tu registro antes de modificar un rol.');
  }

  if (!usuario.alumno.idEmpresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  if (usuario.alumno.rolEmpresa?.nombreRol !== 'CEO') {
    throw new ForbiddenError('Solo un Director Ejecutivo (CEO) puede modificar un rol');
  }

  const alumno = await alumnoRepository.findByIdWithEmpresaRolOrThrow(idAlumno);

  if (alumno.idEmpresa !== usuario.alumno.idEmpresa) {
    throw new ConflictError('El alumno a modificar no pertenece a la empresa');
  }

  if (alumno.id === usuario.alumno.id) {
    throw new ConflictError('No puedes modificar tu propio rol');
  }

  if (idRolEmpresa === usuario.alumno.idRolEmpresa) {
    throw new ForbiddenError('El Director Ejecutivo no puede asignar el rol CEO');
  }

  await transactionRepository.ejecutarTransaccion(async (tx) => {
    const alumnoModificado = await alumnoRepository.updateRolEmpresa(alumno.id, idRolEmpresa, tx);

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.ALUMNO,
      entityId: alumno.id,
      empresaId: usuario.alumno!.idEmpresa!,
      oldValues: alumno,
      newValues: alumnoModificado,
      description: 'Se modificó el rol de un participante en la empresa',
    });
  });
}

export async function modificarRolesEmpresa(
  user: AuthUser,
  idEmpresa: number,
  roles: ModificarRolesDTO
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithProfesorCursosOrThrow(
    user.keycloakId
  );

  const empresa = await empresaRepository.findByIdWithAlumnosOrThrow(idEmpresa);

  const dictaCurso = usuario.profesorCursos.some(
    (profesorCurso) => profesorCurso.idCurso === empresa.idCurso
  );

  if (!dictaCurso) {
    throw new ForbiddenError('El docente no tiene permisos para modificar esta empresa');
  }

  // Deben enviarse todos los integrantes de la empresa
  if (roles.length !== empresa.alumnos.length) {
    throw new ConflictError('Debe enviarse el rol de todos los integrantes de la empresa');
  }

  // No puede haber alumnos repetidos
  const idsRecibidos = roles.map((rol) => rol.idAlumno);

  if (new Set(idsRecibidos).size !== idsRecibidos.length) {
    throw new ConflictError('Hay alumnos repetidos en la solicitud');
  }

  // Todos los alumnos deben pertenecer a la empresa
  const idsEmpresa = empresa.alumnos.map((alumno) => alumno.id);

  for (const idAlumno of idsRecibidos) {
    if (!idsEmpresa.includes(idAlumno)) {
      throw new ConflictError('Se intentó modificar un alumno que no pertenece a la empresa');
    }
  }

  // Verificar que no falte ningún integrante
  for (const idAlumno of idsEmpresa) {
    if (!idsRecibidos.includes(idAlumno)) {
      throw new ConflictError('Debe enviarse el rol de todos los integrantes de la empresa');
    }
  }

  // Validar roles existentes
  const rolesEmpresa = await rolEmpresaRepository.findAll();

  const idsRoles = rolesEmpresa.map((rol) => rol.idRol);

  for (const rol of roles) {
    if (!idsRoles.includes(rol.idRolEmpresa)) {
      throw new NotFoundError('Rol de empresa inexistente');
    }
  }

  // Debe quedar exactamente un CEO
  const rolCEO = rolesEmpresa.find((rol) => rol.nombreRol === 'CEO');

  if (!rolCEO) {
    throw new ConflictError('Se debe asignar al menos un rol CEO');
  }

  const cantidadCEO = roles.filter((rol) => rol.idRolEmpresa === rolCEO.idRol).length;

  if (cantidadCEO !== 1) {
    throw new ConflictError('La empresa debe tener exactamente un Director Ejecutivo');
  }

  await transactionRepository.ejecutarTransaccion(async (tx) => {
    await alumnoRepository.updateRoles(roles, tx);

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.EMPRESA,
      entityId: empresa.id,
      empresaId: empresa.id,
      newValues: { nuevosRoles: roles },
      oldValues: empresa.alumnos,
      description: 'El docente modificó los roles de la empresa',
    });
  });
}

export async function crearInvitaciones(user: AuthUser, data: CrearInvitacionesDTO) {
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  const alumno = usuario.alumno;

  if (!alumno) {
    throw new ConflictError('Debes completar el registro de alumno antes de crear una empresa.');
  }

  if (!alumno.empresa) {
    throw new BadRequestError('El usuario no pertenece a ninguna empresa');
  }

  if (alumno.rolEmpresa?.nombreRol !== 'CEO') {
    throw new ForbiddenError('Solo el Director Ejecutivo puede enviar invitaciones');
  }

  if (!alumno.empresa.activo) {
    throw new ConflictError('La empresa no se encuentra activa.');
  }

  await validarCorreosInvitacion(usuario.email, alumno.empresa.id, data.emails);

  const invitaciones: InvitacionDTO[] = data.emails.map((email) => ({
    empresaId: alumno.empresa!.id,
    createdById: usuario.id,
    email,
    token: generarTokenInvitacion(),
    fechaExpiracion: obtenerFechaExpiracionInvitacion(),
  }));

  await transactionRepository.ejecutarTransaccion(async (tx) => {
    const invitacionesCreadas = await invitacionRepository.crearInvitaciones(invitaciones, tx);

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.INVITACION,
      entityId: alumno.empresa!.id, // id de empresa sirve como agrupador para multiples invitaciones
      empresaId: alumno.empresa!.id,
      newValues: { cantidad: invitacionesCreadas.length, emails: data.emails },
      description: 'Se crearon nuevas invitaciones para la empresa',
    });
  });

  await Promise.all(
    invitaciones.map((invitacion) =>
      sendInvitationEmail(invitacion.email, alumno.empresa!.nombre, invitacion.fechaExpiracion)
    )
  );
}

async function validarCorreosInvitacion(emailUsuario: string, empresaId: number, emails: string[]) {
  for (const email of emails) {
    if (email === emailUsuario) {
      throw new ConflictError('No puedes enviarte una invitación a ti mismo.', {
        email,
      });
    }

    const usuarioExistente = await usuarioRepository.findByEmail(email);

    if (usuarioExistente) {
      throw new ConflictError('El correo ya pertenece a un usuario registrado.', {
        email,
      });
    }

    const invitacionExistente = await invitacionRepository.findPendienteByEmail(email);

    if (
      invitacionExistente &&
      invitacionExistente.estado === 'PENDIENTE' &&
      invitacionExistente.fechaExpiracion > new Date()
    ) {
      throw new ConflictError(`Ya existe una invitación pendiente para ${email}.`, {
        email,
      });
    }
  }
}

export async function getInvitacionesEnviadas(user: AuthUser) {
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  const alumno = usuario.alumno;

  if (!alumno) {
    throw new ConflictError(
      'Debes completar el registro de alumno para consultar las invitaciones.'
    );
  }

  if (!alumno.empresa) {
    throw new BadRequestError('El usuario no pertenece a ninguna empresa.');
  }

  if (alumno.rolEmpresa?.nombreRol !== 'CEO') {
    throw new ForbiddenError('Solo el Director Ejecutivo puede consultar las invitaciones.');
  }

  return invitacionRepository.findByEmpresa(alumno.empresa.id);
}
