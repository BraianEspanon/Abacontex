import { prisma } from '../lib/prisma';

export async function findByIds(cursoIds: number[]) {
  return prisma.curso.findMany({
    where: {
      idCurso: {
        in: cursoIds,
      },
    },
  });
}
