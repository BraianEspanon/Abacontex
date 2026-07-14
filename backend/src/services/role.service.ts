import { ROLES } from '../constants/roles';
import { ConfigurationError } from '../errors/configuration.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import * as rolSistemaRepository from '../repositories/rol-sistema.repository';

export const getRolSistema = async (rolesKeycloak: string[]) => {
  const rolEncontrado = Object.values(ROLES).find((rol) => rolesKeycloak.includes(rol));

  if (!rolEncontrado) {
    throw new UnauthorizedError('El usuario no posee un rol válido.', {
      reason: 'INVALID_ROLE',
      userRoles: rolesKeycloak,
    });
  }

  const rolSistema = await rolSistemaRepository.findRol(rolEncontrado);

  if (!rolSistema) {
    throw new ConfigurationError(`El rol '${rolEncontrado}' no existe en la base de datos.`, {
      role: rolEncontrado,
    });
  }

  return rolSistema;
};
