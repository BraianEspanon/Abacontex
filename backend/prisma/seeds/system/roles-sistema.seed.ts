import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const rolesSistemaSeed: Seed = {
  name: 'Roles del sistema',

  async run(prisma: PrismaClient) {
    await prisma.rolesSistema.createMany({
      data: [
        {
          nombreRol: 'ADMIN',
          descripcion: 'Administrador del sistema',
        },

        {
          nombreRol: 'DOCENTE',
          descripcion: 'Profesor',
        },

        {
          nombreRol: 'ALUMNO',
          descripcion: 'Alumno',
        },
      ],

      skipDuplicates: true,
    });
  },
};
