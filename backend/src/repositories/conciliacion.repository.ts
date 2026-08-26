import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

export async function findUltimaByEmpresa(idEmpresa: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.conciliacionFinanciera.findFirst({
    where: { empresaId: idEmpresa },
    orderBy: { fecha: 'desc' },
  });
}

export async function create(
  data: Omit<Prisma.ConciliacionFinancieraUncheckedCreateInput, 'idConciliacion' | 'createdAt'>,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.conciliacionFinanciera.create({
    data,
  });
}
