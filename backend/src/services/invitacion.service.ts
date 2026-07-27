import { AuthUser } from '../types/express';
import { EstadoInvitacion } from '@prisma/client';

import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict.error';
import { ForbiddenError } from '../errors/forbidden.error';

import * as alumnoRepository from '../repositories/alumno.repository';
import * as invitacionRepository from '../repositories/invitacion.repository';
import * as usuarioRepository from '../repositories/usuario.repository';

import { CrearInvitacionesDTO } from '../validators/invitacion.validator';

import { generarTokenInvitacion } from '../utils/token.util';
import { obtenerFechaExpiracionInvitacion } from '../utils/date.util';

import { InvitacionDTO } from '../dto/invitacion/inv-crear.dto';

import { sendInvitationEmail } from '../integrations/email/email.service';

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

  await invitacionRepository.crearInvitaciones(invitaciones);

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
      invitacionExistente.estado === EstadoInvitacion.PENDIENTE &&
      invitacionExistente.fechaExpiracion > new Date()
    ) {
      throw new ConflictError(`Ya existe una invitación pendiente para ${email}.`, {
        email,
      });
    }
  }
}

export async function getInvitacionesPendientes(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  return invitacionRepository.findPendienteByEmail(usuario.email);
}

async function validarInvitacionPendienteDelUsuario(user: AuthUser, idInvitacion: number) {
  const usuario = await usuarioRepository.findByKeycloakIdWithRolEmpresaOrThrow(user.keycloakId);

  const invitacion = await invitacionRepository.findByIdOrThrow(idInvitacion);

  if (invitacion.email !== usuario.email) {
    throw new ForbiddenError('La invitación no pertenece al usuario autenticado.');
  }

  if (invitacion.estado !== EstadoInvitacion.PENDIENTE) {
    throw new ConflictError('La invitación ya fue procesada.');
  }

  if (invitacion.fechaExpiracion <= new Date()) {
    throw new ConflictError('La invitación ha expirado.');
  }

  if (!invitacion.empresa.activo) {
    throw new ConflictError('La empresa ya no se encuentra activa.');
  }

  if (!usuario.alumno) {
    throw new ConflictError(
      'Debes completar tu registro de alumno antes de aceptar o rechazar una invitación.'
    );
  }

  if (usuario.alumno.idCurso !== invitacion.empresa.idCurso) {
    throw new ConflictError('La invitación corresponde a una empresa de otro curso.', {
      cursoAlumno: usuario.alumno.idCurso,
      cursoEmpresa: invitacion.empresa.idCurso,
    });
  }

  return {
    usuario,
    invitacion,
  };
}

export async function aceptarInvitacion(user: AuthUser, idInvitacion: number) {
  const { usuario, invitacion } = await validarInvitacionPendienteDelUsuario(user, idInvitacion);

  if (usuario.alumno!.idEmpresa) {
    throw new ConflictError('Ya perteneces a una empresa.');
  }

  if (usuario.alumno!.rolEmpresa?.nombreRol === 'CEO') {
    throw new ConflictError('No puedes entrar a otra empresa si eres CEO.');
  }

  await invitacionRepository.aceptar(invitacion, usuario.alumno!.id);
}

export async function rechazarInvitacion(user: AuthUser, idInvitacion: number) {
  const { invitacion } = await validarInvitacionPendienteDelUsuario(user, idInvitacion);

  await invitacionRepository.rechazar(invitacion.id);
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
