import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function ejecutarTransaccion<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
) {
  return prisma.$transaction(callback);
}
