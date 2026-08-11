import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const cursosSeed: Seed = {
  name: 'Cursos',

  async run(prisma: PrismaClient) {
    const cursos = [
      { nombreCurso: '5to II', año: 5 },
      { nombreCurso: '5to III', año: 5 },
      { nombreCurso: '6to II', año: 6 },
      { nombreCurso: '6to III', año: 6 },
    ];

    await Promise.all(
      cursos.map(({ nombreCurso, año }) =>
        prisma.curso.upsert({
          where: { nombreCurso },
          update: {
            año,
          },
          create: {
            nombreCurso,
            año,
          },
        })
      )
    );

    console.log('Cursos demo creados');
  },
};
