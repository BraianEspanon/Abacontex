import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const estadosPedidoSeed: Seed = {
  name: 'Estados de pedido',

  async run(prisma: PrismaClient) {
    await prisma.estadoPedido.createMany({
      data: [
        { nombre: 'PENDIENTE' },
        { nombre: 'EN_PRODUCCION' },
        { nombre: 'LISTO_PARA_ENTREGAR' },
        { nombre: 'COMPLETADO' },
        { nombre: 'CANCELADO' },
      ],

      skipDuplicates: true,
    });
  },
};
