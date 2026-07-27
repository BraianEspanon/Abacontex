import { NotFoundError } from '../errors/not-found.error';
import { prisma } from '../lib/prisma';

export async function findById(idRol: number) {
  return prisma.rolesEmpresa.findUnique({
    where: {
      idRol,
    },
  });
}

export async function findByIdOrThrow(idRol: number) {
  const rol = await findById(idRol);

  if (!rol) {
    throw new NotFoundError('Rol empresarial no encontrado en base de datos.', {
      idRol,
    });
  }

  return rol;
}

export async function findAll() {
  return prisma.rolesEmpresa.findMany({
    orderBy: {
      idRol: 'asc',
    },
  });
}
