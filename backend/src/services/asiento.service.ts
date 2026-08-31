import { AuthUser } from '../types/express';
import { TIPOS_MOVIMIENTO_ASIENTO } from '../constants/asiento.constants';
import * as usuarioRepository from '../repositories/usuario.repository';

export async function obtenerTiposMovimiento(user: AuthUser) {
  await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  return TIPOS_MOVIMIENTO_ASIENTO;
}
