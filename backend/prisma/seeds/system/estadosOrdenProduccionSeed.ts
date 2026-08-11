import { PrismaClient } from '@prisma/client';
import type { Seed } from '../types';

export const estadosOrdenProduccionSeed: Seed = {
  name: 'Estados de Orden de Producción',

  async run(prisma: PrismaClient) {
    const estados = [
      { nombre: 'Pendientes' },
      { nombre: 'En Producción' },
      { nombre: 'Finalizadas' },
    ];

    for (const estado of estados) {
      await prisma.estadoOrdenProduccion.upsert({
        where: { nombre: estado.nombre },
        update: {},
        create: { nombre: estado.nombre },
      });
    }

    console.log('✅ Estados de orden de producción sembrados correctamente');
  },
};
