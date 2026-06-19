import { prisma } from '../lib/prisma';
import { ROLES } from '../constants/roles';

export const getRolSistema = async (rolesKeycloak: string[]) => {
  const rolEncontrado = Object.values(ROLES).find((rol) => rolesKeycloak.includes(rol));

  if (!rolEncontrado) {
    throw new Error('El usuario no posee un rol válido');
  }

  const rolSistema = await prisma.rolesSistema.findUnique({
    where: {
      nombreRol: rolEncontrado,
    },
  });

  if (!rolSistema) {
    throw new Error(`Rol ${rolEncontrado} no encontrado`);
  }

  return rolSistema;
};
