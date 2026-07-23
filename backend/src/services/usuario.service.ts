import { AuthUser } from '../types/express';
import { getRolSistema } from './role.service';
import * as keycloakAdminService from '../integrations/keycloak/keycloak-admin.service';
import * as usuarioRepository from '../repositories/usuario.repository';
import { ActualizarContraseñaDTO, ActualizarUsuarioDTO } from '../validators/usuario.validator';

export async function syncUsuario(user: AuthUser) {
  let usuario = await usuarioRepository.findByKeycloakId(user.keycloakId);

  if (usuario) {
    return usuario;
  }

  const rolSistema = await getRolSistema(user.roles);

  usuario = await usuarioRepository.create(user, rolSistema.idRol);

  return usuario;
}

export async function getUsuarioActual(user: AuthUser) {
  return usuarioRepository.findByKeycloakIdWithRolSistemaOrThrow(user.keycloakId);
}

export async function actualizarUsuarioActual(user: AuthUser, data: ActualizarUsuarioDTO) {
  await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  await keycloakAdminService.updateUser(user.keycloakId, {
    firstName: data.nombre,
    lastName: data.apellido,
  });

  await usuarioRepository.update(user.keycloakId, data);

  return getUsuarioActual(user);
}

export async function actualizarPassword(user: AuthUser, data: ActualizarContraseñaDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  await keycloakAdminService.verifyPassword(usuario.email, data.currentPassword);

  await keycloakAdminService.updatePassword(user.keycloakId, data.newPassword);
}
