import { prisma } from '../lib/prisma';

export async function getRolesEmpresa() {
  return prisma.rolesEmpresa.findMany({
    orderBy: {
      idRol: 'asc',
    },
    select: {
      idRol: true,
      nombreRol: true,
      descripcion: true,
    },
  });
}
