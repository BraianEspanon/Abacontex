import { PrismaClient } from '@prisma/client';

export interface Seed {
  name: string;

  run(prisma: PrismaClient): Promise<void>;
}
