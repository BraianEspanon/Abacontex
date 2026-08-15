import { AuthUser } from '../types/express';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as metodoPagoRepository from '../repositories/metodo-pago.repository';

import { ConflictError } from '../errors/conflict.error';

export async function obtenerMetodosPagoDisponibles(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const año = usuario.alumno.empresa.curso.año;

  return metodoPagoRepository.findDisponiblesPorAño(año);
}
