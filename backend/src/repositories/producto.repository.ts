import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

import {
  ActualizarProductoDTO,
  CrearProductoDTO,
  ObtenerProductosDTO,
} from '../validators/producto.validator';

import { NotFoundError } from '../errors/not-found.error';

export async function findByIdAndEmpresaWithStorageOrThrow(id: number, empresaId: number) {
  const producto = await prisma.producto.findFirst({
    where: {
      id,
      empresaId,
      activo: true,
    },
  });

  if (!producto) {
    throw new NotFoundError('Producto no encontrado.', {
      idProducto: id,
    });
  }

  return producto;
}

export async function findByIdAndEmpresaOrThrow(id: number, empresaId: number) {
  const producto = await prisma.producto.findFirst({
    where: {
      id,
      empresaId,
      activo: true,
    },

    select: {
      id: true,
      empresaId: true,
      nombre: true,
      descripcion: true,
      stock: true,
      precioUnitario: true,
      margenGanancia: true,
      precioVenta: true,
      precioConsumidorFinal: true,
      fotoUrl: true,
      activo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!producto) {
    throw new NotFoundError('Producto no encontrado.', {
      idProducto: id,
    });
  }

  return producto;
}

export async function findByNombre(empresaId: number, nombre: string) {
  return prisma.producto.findFirst({
    where: {
      empresaId,
      nombre,
      activo: true,
    },
  });
}

export async function findByEmpresa(
  empresaId: number,
  search: string | undefined,
  page: number,
  pageSize: number,
  estadoStock: ObtenerProductosDTO['estadoStock'],
  orden: ObtenerProductosDTO['orden']
) {
  const where: Prisma.ProductoWhereInput = {
    empresaId,
    activo: true,
  };

  if (search) {
    where.nombre = {
      contains: search,
      mode: 'insensitive',
    };
  }

  switch (estadoStock) {
    case 'CON_STOCK':
      where.stock = {
        gt: 0,
      };
      break;

    case 'SIN_STOCK':
      where.stock = 0;
      break;
  }

  let orderBy: Prisma.ProductoOrderByWithRelationInput;

  switch (orden) {
    case 'NOMBRE_DESC':
      orderBy = { nombre: 'desc' };
      break;

    case 'STOCK_ASC':
      orderBy = { stock: 'asc' };
      break;

    case 'STOCK_DESC':
      orderBy = { stock: 'desc' };
      break;

    case 'NOMBRE_ASC':
    default:
      orderBy = { nombre: 'asc' };
  }

  const [totalItems, items, total, conStock, sinStock, productosResumen] =
    await prisma.$transaction([
      //totalItems
      prisma.producto.count({ where }),

      //items
      prisma.producto.findMany({
        where,

        select: {
          id: true,

          nombre: true,

          descripcion: true,

          fotoUrl: true,

          precioUnitario: true,

          margenGanancia: true,

          precioVenta: true,

          precioConsumidorFinal: true,

          stock: true,
        },

        orderBy,

        skip: (page - 1) * pageSize,

        take: pageSize,
      }),

      //total
      prisma.producto.count({
        where: { empresaId, activo: true },
      }),

      //conStock,
      prisma.producto.count({
        where: {
          empresaId,
          activo: true,
          stock: {
            gt: 0,
          },
        },
      }),

      //sinStock
      prisma.producto.count({
        where: {
          empresaId,
          activo: true,
          stock: 0,
        },
      }),

      //productosResumen
      prisma.producto.findMany({
        where: {
          empresaId,
          activo: true,
        },
        select: {
          stock: true,
          precioVenta: true,
        },
      }),
    ]);

  const valorEstimado = productosResumen.reduce(
    (total, producto) => total + Number(producto.precioVenta) * producto.stock,
    0
  );

  return {
    totalItems,

    resumen: {
      total,
      conStock,
      sinStock,
      valorEstimado,
    },

    items,
  };
}

export async function create(
  empresaId: number,
  data: CrearProductoDTO,
  fotoUrl: string | null,
  fotoPublicId: string | null,
  precioVenta: number,
  precioConsumidorFinal: number
) {
  return prisma.producto.create({
    data: {
      empresaId,

      nombre: data.nombre,
      descripcion: data.descripcion,

      stock: data.stockInicial,

      precioUnitario: data.precioUnitario,
      margenGanancia: data.margenGanancia,
      precioVenta,
      precioConsumidorFinal,

      fotoUrl,
      fotoPublicId,
    },
  });
}

export async function update(
  id: number,
  data: ActualizarProductoDTO,
  fotoUrl: string | null,
  fotoPublicId: string | null,
  precioVenta: number,
  precioConsumidorFinal: number
) {
  return prisma.producto.update({
    where: {
      id,
    },

    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precioUnitario: data.precioUnitario,
      margenGanancia: data.margenGanancia,
      precioVenta,
      precioConsumidorFinal,

      fotoUrl,
      fotoPublicId,
    },
  });
}

export async function remove(idProducto: number) {
  return prisma.producto.update({
    where: {
      id: idProducto,
    },
    data: {
      activo: false,
    },
  });
}

export async function incrementarStock(
  tx: Prisma.TransactionClient,
  productoId: number,
  cantidad: number
) {
  return tx.producto.update({
    where: {
      id: productoId,
    },
    data: {
      stock: {
        increment: cantidad,
      },
    },
  });
}
