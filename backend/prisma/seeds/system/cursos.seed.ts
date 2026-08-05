import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const cursosSeed: Seed = {
  name: 'Cursos',

  async run(prisma: PrismaClient) {
    const cursos = ['5to II', '5to III', '6to II', '6to III'];

    await Promise.all(
      cursos.map((nombreCurso) =>
        prisma.curso.upsert({
          where: { nombreCurso },
          update: {},
          create: { nombreCurso },
        })
      )
    );

    console.log('Cursos demo creados');
  },
};
