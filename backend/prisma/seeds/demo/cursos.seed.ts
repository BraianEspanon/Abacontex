import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const cursosSeed: Seed = {
  name: 'Cursos',

  async run(prisma: PrismaClient) {
    await prisma.curso.upsert({
<<<<<<< HEAD
      where: { nombreCurso: '5to II' },

=======
      where: {
        nombreCurso: '5to II',
      },
>>>>>>> develop
      update: {},
      create: {
        nombreCurso: '5to II',
      },
    });

    await prisma.curso.upsert({
<<<<<<< HEAD
      where: { nombreCurso: '6to III' },

=======
      where: {
        nombreCurso: '6to III',
      },
>>>>>>> develop
      update: {},
      create: {
        nombreCurso: '6to III',
      },
    });

    console.log('Cursos demo creados');
  },
};
