import { PrismaClient } from '@prisma/client';

import { systemSeeds } from './system';
import { demoSeeds } from './demo';

export async function runSeeds(prisma: PrismaClient) {
  console.log('🌱 Ejecutando system seeds');

  for (const seed of systemSeeds) {
    console.log(`▶ ${seed.name}`);
    await seed.run(prisma);
  }

  if (process.env.ENVIRONMENT === 'development') {
    console.log('🌱 Ejecutando demo seeds');

    for (const seed of demoSeeds) {
      console.log(`▶ ${seed.name}`);
      await seed.run(prisma);
    }
  }

  console.log('✅ Seeds finalizados');
}
