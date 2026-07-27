import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const rolesEmpresaSeed: Seed = {
  name: 'Roles de empresa',

  async run(prisma: PrismaClient) {
    await prisma.rolesEmpresa.createMany({
      data: [
        {
          nombreRol: 'CEO',
          descripcion: 'Director Ejecutivo',
        },

        {
          nombreRol: 'COO',
          descripcion: 'Director de Operaciones',
        },

        {
          nombreRol: 'CFO',
          descripcion: 'Director Financiero',
        },

        {
          nombreRol: 'CTO',
          descripcion: 'Director Tecnológico',
        },

        {
          nombreRol: 'CCO',
          descripcion: 'Director de Comunicación',
        },

        {
          nombreRol: 'CIO',
          descripcion: 'Director de Sistemas de Información',
        },

        {
          nombreRol: 'CMO',
          descripcion: 'Director de Marketing',
        },
      ],

      skipDuplicates: true,
    });
  },
};
