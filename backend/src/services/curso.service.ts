import { prisma } from '../lib/prisma';

export async function getCursos() {
  return prisma.curso.findMany({
    orderBy: {
      nombreCurso: 'asc',
    },
    select: {
      idCurso: true,
      nombreCurso: true,
    },
  });
}
