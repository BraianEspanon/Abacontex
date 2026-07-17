import { ROLES } from '../constants/roles';
import { NotFoundError } from '../errors/not-found.error';
import { prisma } from '../lib/prisma';

export async function findRol(nombreRol: string) {
  return prisma.rolesSistema.findUnique({
    where: {
      nombreRol,
    },
  });
}

export async function findDocente() {
  return prisma.rolesSistema.findUnique({
    where: {
      nombreRol: ROLES.DOCENTE,
    },
  });
}
export async function findDocenteOrThrow() {
  const rolDocente = await findDocente();

  if (!rolDocente) {
    throw new NotFoundError('Rol no encontrado en base de datos.', {
      rol: ROLES.DOCENTE,
    });
  }

  return rolDocente;
}
