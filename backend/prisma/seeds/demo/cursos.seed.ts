import { PrismaClient } from '@prisma/client';
import type { Seed } from '../types';

export const cursosSeed: Seed = {
  name: 'Cursos',

  async run(prisma: PrismaClient) {
    await prisma.curso.upsert({
      where: { nombreCurso: '5to II' },

      update: {},

      create: {
        nombreCurso: '5to II',
      },
    });

    await prisma.curso.upsert({
      where: { nombreCurso: '6to III' },

      update: {},

      create: {
        nombreCurso: '6to III',
      },
    });
  },
};
