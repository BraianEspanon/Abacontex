import { NotFoundError } from '../errors/not-found.error';
import { prisma } from '../lib/prisma';

export async function findAll() {
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

export async function findByIdsOrThrow(ids: number[]) {
  const cursos = await findByIds(ids);

  if (cursos.length !== ids.length) {
    const encontrados = new Set(cursos.map((c) => c.idCurso));

    const faltantes = ids.filter((id) => !encontrados.has(id));

    throw new NotFoundError('Uno o más cursos no existen.', {
      cursos: faltantes,
    });
  }

  return cursos;
}
