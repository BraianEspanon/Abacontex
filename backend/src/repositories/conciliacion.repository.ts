import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

export async function findUltimaByEmpresa(
  idEmpresa: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.conciliacionFinanciera.findFirst({
    where: { empresaId: idEmpresa },
    orderBy: { fecha: 'desc' },
  });
}
