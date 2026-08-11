import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

const metodosPago = ['Efectivo', 'Transferencia', 'Crédito', 'Pagaré', 'Cheque'];

export const metodosPagoSeed: Seed = {
  name: 'Métodos de pago',

  async run(prisma: PrismaClient) {
    await Promise.all(
      metodosPago.map((nombre) =>
        prisma.metodoPago.upsert({
          where: { nombre },
          update: {},
          create: { nombre },
        })
      )
    );

    console.log('Métodos de pago creados');
  },
};
