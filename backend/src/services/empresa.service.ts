import { AuthUser } from '../types/express';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as alumnoRepository from '../repositories/alumno.repository';
import * as empresaRepository from '../repositories/empresa.repository';
import * as rolEmpresaRepository from '../repositories/rol-empresa.repository';

import {
  AgregarParticipantesDTO,
  CrearEmpresaDTO,
  ModificarRolesDTO,
} from '../validators/empresa.validator';

import { ConflictError } from '../errors/conflict.error';
import { ForbiddenError } from '../errors/forbidden.error';

import { toEmpresaActualResponse } from '../dto/empresa/emp.mapper';
import { toCandidatoResponse } from '../dto/alumno/alu.mapper';
import { NotFoundError } from '../errors/not-found.error';

export async function crearEmpresa(user: AuthUser, data: CrearEmpresaDTO) {
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

  const empresa = await empresaRepository.create(
    data,
    alumno.idCurso,
    1, //CAMBIAR CICLO LECTIVO CUANDO SE IMPLEMENTE REALMENTE
    usuario.id
  );

  return empresa;
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

export async function actualizarEmpresa(user: AuthUser, data: CrearEmpresaDTO) {
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

  await empresaRepository.update(empresa.id, data);

  return getEmpresaActual(user);
}

export async function getCandidatos(user: AuthUser, search?: string) {
  const usuario = await usuarioRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('Debes completar tu registro antes de obtener candidatos.');
  }

  if (!usuario.alumno.idEmpresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
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

  await alumnoRepository.agregarAEmpresa(ids, usuario.alumno.idEmpresa!);
}

export async function cambiarRolParticipante(
  user: AuthUser,
  idAlumno: string,
  idRolEmpresa: number
) {
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

  await alumnoRepository.updateRolEmpresa(alumno.id, idRolEmpresa);
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

  await alumnoRepository.updateRoles(roles);
}
