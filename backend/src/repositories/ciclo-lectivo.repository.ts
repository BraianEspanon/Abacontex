import { Prisma } from '@prisma/client';

import { getDbClient } from '../lib/prisma';

export async function findActivoOrThrow(tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.cicloLectivo.findFirstOrThrow({
    where: {
      activo: true,
    },
  });
}
