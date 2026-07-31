import { AuthUser } from '../types/express';

import { CompletarRegistroDTO } from '../validators/alumno.validator';
import { UsuarioActualResponseDTO } from '../dto/alumno/alu-actual.dto';
import { toAlumnoActualResponse } from '../dto/alumno/alu.mapper';

import * as alumnoRepository from '../repositories/alumno.repository';
import * as usuarioRepository from '../repositories/usuario.repository';
import * as cursoRepository from '../repositories/curso.repository';
import * as rolEmpresaRepository from '../repositories/rol-empresa.repository';
import * as invitacionRepository from '../repositories/invitacion.repository';

import { ConflictError } from '../errors/conflict.error';
import { ForbiddenError } from '../errors/forbidden.error';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found.error';

export async function getAlumnoActual(user: AuthUser): Promise<UsuarioActualResponseDTO> {
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  return toAlumnoActualResponse(usuario);
}

export async function getInvitacion(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  const invitacion = await invitacionRepository.findByEmail(usuario.email);

  if (!invitacion) {
    throw new NotFoundError('El usuario no posee invitaciones activas.');
  }

  if (invitacion.estado === 'PENDIENTE' && invitacion.fechaExpiracion <= new Date()) {
    await invitacionRepository.expirar(invitacion.id);

    throw new NotFoundError('El usuario no posee invitaciones activas.');
  }

  if (!invitacion.empresa.activo) {
    throw new NotFoundError('El usuario no posee invitaciones activas.');
  }

  return invitacion;
}

async function getInvitacionPendienteDelUsuarioOrThrow(user: AuthUser, idInvitacion: number) {
  const usuario = await usuarioRepository.findByKeycloakIdWithRolEmpresaOrThrow(user.keycloakId);

  const invitacion = await invitacionRepository.findByIdOrThrow(idInvitacion);

  if (invitacion.email !== usuario.email) {
    throw new ForbiddenError('La invitación no pertenece al usuario autenticado.');
  }

  if (invitacion.estado !== 'PENDIENTE') {
    throw new ConflictError('La invitación ya fue procesada.');
  }

  if (invitacion.fechaExpiracion <= new Date()) {
    throw new ConflictError('La invitación ha expirado.');
  }

  if (!invitacion.empresa.activo) {
    throw new ConflictError('La empresa ya no se encuentra activa.');
  }

  return {
    usuario,
    invitacion,
  };
}

export async function aceptarInvitacion(user: AuthUser, idInvitacion: number) {
  const { usuario, invitacion } = await getInvitacionPendienteDelUsuarioOrThrow(user, idInvitacion);

  if (usuario.alumno) {
    throw new ConflictError('No puedes aceptar una invitación porque ya completaste tu registro.');
  }

  await invitacionRepository.aceptar(invitacion.id);
}

export async function rechazarInvitacion(user: AuthUser, idInvitacion: number) {
  const { invitacion } = await getInvitacionPendienteDelUsuarioOrThrow(user, idInvitacion);

  await invitacionRepository.rechazar(invitacion.id);
}

export async function completarRegistro(
  user: AuthUser,
  data: CompletarRegistroDTO
): Promise<UsuarioActualResponseDTO> {
  const usuario = await usuarioRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (usuario.alumno) {
    throw new ConflictError('El registro del alumno ya fue completado previamente.');
  }

  const invitacion = await invitacionRepository.findAceptadaByEmail(usuario.email);

  const rol = await rolEmpresaRepository.findByIdOrThrow(data.idRolEmpresa);

  if (invitacion) {
    if (!invitacion.empresa.activo) {
      throw new ConflictError('La empresa ya no se encuentra activa.');
    }

    if (rol.nombreRol === 'CEO') {
      throw new ConflictError('No puedes registrarte como CEO mediante una invitación.');
    }

    await alumnoRepository.create(usuario.id, {
      idCurso: invitacion.empresa.idCurso,
      idEmpresa: invitacion.empresa.id,
      idRolEmpresa: data.idRolEmpresa,
    });

    await invitacionRepository.finalizar(invitacion.id);
  } else {
    if (!data.idCurso) {
      throw new BadRequestError('Debe seleccionar un curso.');
    }

    await cursoRepository.findByIdOrThrow(data.idCurso);

    await alumnoRepository.create(usuario.id, {
      idCurso: data.idCurso,
      idEmpresa: null,
      idRolEmpresa: data.idRolEmpresa,
    });
  }

  return getAlumnoActual(user);
}
