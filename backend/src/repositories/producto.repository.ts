import { prisma } from '../lib/prisma';

import { ActualizarProductoDTO, CrearProductoDTO } from '../validators/producto.validator';

import { NotFoundError } from '../errors/not-found.error';

export async function findById(id: number) {
  return prisma.producto.findUnique({
    where: {
      id,
    },
  });
}

export async function findByIdOrThrow(id: number) {
  const producto = await findById(id);

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

export async function create(empresaId: number, data: CrearProductoDTO) {
  return prisma.producto.create({
    data: {
      empresaId,

      nombre: data.nombre,
      descripcion: data.descripcion,

      stock: data.stockInicial,

      precioUnitario: data.precioUnitario,

      fotoUrl: data.fotoUrl ?? null,
    },
  });
}

export async function update(id: number, data: ActualizarProductoDTO) {
  return prisma.producto.update({
    where: {
      id,
    },

    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precioUnitario: data.precioUnitario,
      fotoUrl: data.fotoUrl ?? null,
    },
  });
}
