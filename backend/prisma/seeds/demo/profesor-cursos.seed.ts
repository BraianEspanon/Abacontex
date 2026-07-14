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
        nombreCurso: '5to Año A',
      },
    });

    const curso6to = await prisma.curso.findUnique({
      where: {
        nombreCurso: '6to Año B',
      },
    });

    if (!profesor || !curso5to || !curso6to) {
      throw new Error('No existen el profesor o los cursos.');
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
  },
};
