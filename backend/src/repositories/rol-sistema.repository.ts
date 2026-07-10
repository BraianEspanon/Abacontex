import { ROLES } from '../constants/roles';
import { prisma } from '../lib/prisma';

export async function findDocente() {
  return prisma.rolesSistema.findUnique({
    where: {
      nombreRol: ROLES.DOCENTE,
    },
  });
}
