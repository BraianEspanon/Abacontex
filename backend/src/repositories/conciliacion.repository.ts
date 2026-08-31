import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { ConsultarHistorialConciliacionesDTO } from '../validators/conciliacion.validator';

export async function findUltimaByEmpresa(idEmpresa: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.conciliacionFinanciera.findFirst({
    where: { empresaId: idEmpresa },
    orderBy: { createdAt: 'desc' },
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

export async function findHistorial(
  empresaId: number,
  filtros: ConsultarHistorialConciliacionesDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const where: Prisma.ConciliacionFinancieraWhereInput = {
    empresaId,
  };

  const [total, items] = await Promise.all([
    db.conciliacionFinanciera.count({ where }),
    db.conciliacionFinanciera.findMany({
      where,
      orderBy: { fecha: 'asc' },
      skip: (filtros.page - 1) * filtros.pageSize,
      take: filtros.pageSize,
      select: {
        idConciliacion: true,
        fecha: true,
        saldoEsperado: true,
        saldoContado: true,
        diferencia: true,
        observacion: true,
        alumno: {
          select: {
            usuario: {
              select: {
                nombre: true,
                apellido: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return { items, total };
}
