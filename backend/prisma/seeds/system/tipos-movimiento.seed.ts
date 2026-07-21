import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const tiposMovimientoSeed: Seed = {
  name: 'Tipos de movimiento',

  async run(prisma: PrismaClient) {
    await prisma.tipoMovimiento.createMany({
      data: [{ nombre: 'INGRESO' }, { nombre: 'EGRESO' }],

      skipDuplicates: true,
    });
  },
};
