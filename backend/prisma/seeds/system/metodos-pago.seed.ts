import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const metodosPagoSeed: Seed = {
  name: 'Métodos de pago',

  async run(prisma: PrismaClient) {
    await prisma.metodoPago.createMany({
      data: [{ nombre: 'EFECTIVO' }, { nombre: 'TRANSFERENCIA' }, { nombre: 'TARJETA' }],

      skipDuplicates: true,
    });
  },
};
