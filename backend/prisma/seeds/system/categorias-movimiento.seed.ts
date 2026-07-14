import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const categoriasMovimientoSeed: Seed = {
  name: 'Categorías de movimiento',

  async run(prisma: PrismaClient) {
    const ingreso = await prisma.tipoMovimiento.findUnique({
      where: {
        nombre: 'INGRESO',
      },
    });

    const egreso = await prisma.tipoMovimiento.findUnique({
      where: {
        nombre: 'EGRESO',
      },
    });

    if (!ingreso || !egreso) {
      throw new Error('No existen los tipos de movimiento requeridos para crear las categorías.');
    }

    await prisma.categoriaMovimiento.createMany({
      data: [
        {
          nombre: 'VENTA',
          idTipoMovimiento: ingreso.idTipoMovimiento,
        },

        {
          nombre: 'APORTE CAPITAL',
          idTipoMovimiento: ingreso.idTipoMovimiento,
        },

        {
          nombre: 'COMPRA INSUMOS',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },

        {
          nombre: 'GASTO OPERATIVO',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
      ],

      skipDuplicates: true,
    });
  },
};
