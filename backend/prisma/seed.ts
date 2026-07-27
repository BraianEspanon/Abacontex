import 'dotenv/config';

import { prisma } from '../src/lib/prisma';
import { runSeeds } from './seeds/runner';

runSeeds(prisma)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
