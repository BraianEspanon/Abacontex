import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const metodosPagoCursoSeed: Seed = {
  name: 'Métodos de pago por año',

  async run(prisma: PrismaClient) {
    const metodosPago = await prisma.metodoPago.findMany({
      where: {
        nombre: {
          in: ['Efectivo', 'Crédito', 'Transferencia', 'Pagaré', 'Cheque'],
        },
      },
    });

    const metodoPorNombre = new Map(
      metodosPago.map((metodo) => [metodo.nombre, metodo.idMetodoPago])
    );

    const configuracion = [
      // 5to
      { nombre: 'Efectivo', año: 5 },
      { nombre: 'Crédito', año: 5 },
      { nombre: 'Pagaré', año: 5 },
      { nombre: 'Cheque', año: 5 },

      // 6to
      { nombre: 'Efectivo', año: 6 },
      { nombre: 'Crédito', año: 6 },
      { nombre: 'Transferencia', año: 6 },
    ];

    await Promise.all(
      configuracion.map(({ nombre, año }) => {
        const idMetodoPago = metodoPorNombre.get(nombre);

        if (!idMetodoPago) {
          throw new Error(`No se encontró el método de pago "${nombre}".`);
        }

        return prisma.metodoPagoCurso.upsert({
          where: {
            idMetodoPago_año: {
              idMetodoPago,
              año,
            },
          },
          update: {},
          create: {
            idMetodoPago,
            año,
          },
        });
      })
    );

    console.log('Métodos de pago por año creados');
  },
};
