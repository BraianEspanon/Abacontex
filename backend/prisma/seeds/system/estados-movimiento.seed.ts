import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const estadosMovimientoSeed: Seed = {
  name: 'Estados de movimiento',

  async run(prisma: PrismaClient) {
    await prisma.estadoMovimiento.createMany({
      data: [{ nombre: 'PENDIENTE' }, { nombre: 'CONCILIADO' }, { nombre: 'ANULADO' }],
      skipDuplicates: true,
    });
  },
};
