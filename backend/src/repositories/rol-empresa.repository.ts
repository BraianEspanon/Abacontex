import { prisma } from '../lib/prisma';

export async function findAll() {
  return prisma.rolesEmpresa.findMany({
    orderBy: {
      idRol: 'asc',
    },
  });
}
