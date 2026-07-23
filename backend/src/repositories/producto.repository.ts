import { prisma } from '../lib/prisma';

import { CrearProductoDTO } from '../validators/producto.validator';

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
