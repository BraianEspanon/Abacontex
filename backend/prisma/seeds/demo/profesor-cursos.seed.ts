import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const profesorCursosSeed: Seed = {
  name: 'Asignación profesor a cursos',

  async run(prisma: PrismaClient) {
    const profesor = await prisma.usuario.findUnique({
      where: {
        email: 'docente@mail.com',
      },
    });

    const curso5to = await prisma.curso.findUnique({
      where: {
        nombreCurso: '5to II',
      },
    });

    const curso6to = await prisma.curso.findUnique({
      where: {
        nombreCurso: '6to III',
      },
    });

    if (!profesor) {
      throw new Error('No existe el usuario docente@mail.com.');
    }

    if (!curso5to) {
      throw new Error('No existe el curso "5to II".');
    }

    if (!curso6to) {
      throw new Error('No existe el curso "6to III".');
    }

    await prisma.profesorCursos.upsert({
      where: {
        idCurso_idUsuario: {
          idCurso: curso5to.idCurso,
          idUsuario: profesor.id,
        },
      },
      update: {},
      create: {
        idCurso: curso5to.idCurso,
        idUsuario: profesor.id,
      },
    });

    await prisma.profesorCursos.upsert({
      where: {
        idCurso_idUsuario: {
          idCurso: curso6to.idCurso,
          idUsuario: profesor.id,
        },
      },
      update: {},
      create: {
        idCurso: curso6to.idCurso,
        idUsuario: profesor.id,
      },
    });

    console.log('Profesor asignado a los cursos demo');
  },
};