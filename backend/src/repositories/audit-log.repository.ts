import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';

/**
 * Crea un registro en el audit log asegurando que siempre reciba una transacción explícita
 */
export async function createLog(
  data: Prisma.AuditLogUncheckedCreateInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.auditLog.create({
    data,
  });
}
