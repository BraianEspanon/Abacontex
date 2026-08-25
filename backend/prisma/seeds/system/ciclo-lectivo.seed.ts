import { PrismaClient } from '@prisma/client';
import type { Seed } from '../types';

export const cicloLectivoSeed: Seed = {
  name: 'Ciclo lectivo',

  async run(prisma: PrismaClient) {
    await prisma.cicloLectivo.upsert({
      where: { id: 1 },

      update: {},

      create: {
        año: 2026,

        activo: true,
      },
    });
  },
};
