import { NotFoundError } from '../errors/not-found.error';
import { prisma } from '../lib/prisma';

export async function findById(idCurso: number) {
  return prisma.curso.findUnique({
    where: {
      idCurso,
    },
  });
}
export async function findByIdOrThrow(idCurso: number) {
  const curso = await findById(idCurso);

  if (!curso) {
    throw new NotFoundError('Curso no encontrado en base de datos.', {
      idCurso,
    });
  }

  return curso;
}

export async function findByIds(cursoIds: number[]) {
  return prisma.curso.findMany({
    where: {
      idCurso: {
        in: cursoIds,
      },
    },
  });
}
