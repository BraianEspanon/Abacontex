import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { CATEGORIAS_MOVIMIENTO } from '../constants/categorias-movimiento';
import { ESTADOS_MOVIMIENTO } from '../constants/estados-movimiento';

export async function findCategoriaVenta(tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.categoriaMovimiento.findFirstOrThrow({
    where: { nombre: CATEGORIAS_MOVIMIENTO.VENTA },
  });
}

export async function findCategoriaById(idCategoria: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.categoriaMovimiento.findUnique({
    where: { idCategoria },
    include: { tipoMovimiento: true },
  });
}

export async function findAllCategorias(tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.categoriaMovimiento.findMany({
    include: { tipoMovimiento: true },
    orderBy: { nombre: 'asc' },
  });
}

export async function findEstadoRegistrado(tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.estadoMovimiento.findUniqueOrThrow({
    where: { nombre: ESTADOS_MOVIMIENTO.REGISTRADO },
  });
}

export async function create(
  data: Omit<
    Prisma.MovimientoFinancieroUncheckedCreateInput,
    'idMovimiento' | 'createdAt' | 'updatedAt'
  >,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.movimientoFinanciero.create({
    data,
    include: {
      categoria: {
        select: {
          nombre: true,
          tipoMovimiento: { select: { nombre: true } },
        },
      },
      metodoPago: { select: { nombre: true } },
    },
  });
}
