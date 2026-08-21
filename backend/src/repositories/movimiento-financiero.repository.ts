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

export async function findHistorial(
  idEmpresa: number,
  filtros: {
    fechaInicio?: Date | undefined;
    fechaFin?: Date | undefined;
    idTipoMovimiento?: number | undefined;
    page: number;
    pageSize: number;
  },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const where: Prisma.MovimientoFinancieroWhereInput = {
    idEmpresa,
  };

  if (filtros.fechaInicio && filtros.fechaFin) {
    where.fecha = {
      gte: filtros.fechaInicio,
      lte: filtros.fechaFin,
    };
  }

  if (filtros.idTipoMovimiento) {
    where.categoria = {
      idTipoMovimiento: filtros.idTipoMovimiento,
    };
  }

  const [total, items] = await Promise.all([
    db.movimientoFinanciero.count({ where }),
    db.movimientoFinanciero.findMany({
      where,
      orderBy: { fecha: 'desc' },
      skip: (filtros.page - 1) * filtros.pageSize,
      take: filtros.pageSize,
      select: {
        idMovimiento: true,
        fecha: true,
        concepto: true,
        importe: true,
        categoria: {
          select: {
            nombre: true,
            tipoMovimiento: { select: { nombre: true, idTipoMovimiento: true } },
          },
        },
        metodoPago: { select: { nombre: true } },
      },
    }),
  ]);

  return { items, total };
}

export async function findTiposMovimiento(tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);
  return db.tipoMovimiento.findMany();
}

export async function getResumenIndicadores(
  idEmpresa: number,
  añoAcademico: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const fechaInicio = new Date(añoAcademico, 0, 1);
  const fechaFin = new Date(añoAcademico, 11, 31, 23, 59, 59, 999);

  return db.movimientoFinanciero.findMany({
    where: {
      idEmpresa,
      fecha: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    },
    select: {
      fecha: true,
      importe: true,
      categoria: {
        select: {
          tipoMovimiento: { select: { nombre: true } },
        },
      },
    },
  });
}
