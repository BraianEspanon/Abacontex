import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

interface ProductoDemo {
  empresaId: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precioUnitario: number;
  margenGanancia: number;
  fotoUrl: string | null;
}

const IVA = 0.21;

function calcularPrecios(precioUnitario: number, margenGanancia: number) {
  const precioVenta = precioUnitario * (1 + margenGanancia / 100);

  const precioConsumidorFinal = precioVenta * (1 + IVA);

  return {
    precioVenta,
    precioConsumidorFinal,
  };
}

async function crearOActualizarProductoActivo(prisma: PrismaClient, producto: ProductoDemo) {
  const { precioVenta, precioConsumidorFinal } = calcularPrecios(
    producto.precioUnitario,
    producto.margenGanancia
  );

  const productoActivoExistente = await prisma.producto.findFirst({
    where: {
      empresaId: producto.empresaId,
      nombre: producto.nombre,
      activo: true,
    },
    select: {
      id: true,
    },
  });

  if (productoActivoExistente) {
    await prisma.producto.update({
      where: {
        id: productoActivoExistente.id,
      },
      data: {
        descripcion: producto.descripcion,
        stock: producto.stock,
        precioUnitario: producto.precioUnitario,
        margenGanancia: producto.margenGanancia,
        precioVenta,
        precioConsumidorFinal,
        fotoUrl: producto.fotoUrl,
      },
    });

    return;
  }

  await prisma.producto.create({
    data: {
      empresaId: producto.empresaId,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      stock: producto.stock,
      precioUnitario: producto.precioUnitario,
      margenGanancia: producto.margenGanancia,
      precioVenta,
      precioConsumidorFinal,
      fotoUrl: producto.fotoUrl,
      activo: true,
    },
  });
}

export const productosSeed: Seed = {
  name: 'Productos demo',

  async run(prisma: PrismaClient) {
    const techNova = await prisma.empresa.findUnique({
      where: {
        nombre: 'TechNova',
      },
    });

    const innovaSoft = await prisma.empresa.findUnique({
      where: {
        nombre: 'InnovaSoft',
      },
    });

    if (!techNova || !innovaSoft) {
      throw new Error('Las empresas de demo no existen.');
    }

    // ==========================
    // TECHNOVA
    // ==========================

    await crearOActualizarProductoActivo(prisma, {
      empresaId: techNova.id,
      nombre: 'Notebook',
      descripcion: 'Notebook para oficina',
      stock: 15,
      precioUnitario: 700000,
      margenGanancia: 10,
      fotoUrl: null,
    });

    await crearOActualizarProductoActivo(prisma, {
      empresaId: techNova.id,
      nombre: 'Mouse inalámbrico',
      descripcion: 'Mouse óptico inalámbrico',
      stock: 40,
      precioUnitario: 18000,
      margenGanancia: 20,
      fotoUrl: null,
    });

    // ==========================
    // INNOVASOFT
    // ==========================

    await crearOActualizarProductoActivo(prisma, {
      empresaId: innovaSoft.id,
      nombre: 'Licencia ERP',
      descripcion: 'Licencia anual del sistema',
      stock: 100,
      precioUnitario: 50000,
      margenGanancia: 15,
      fotoUrl: null,
    });

    console.log('Productos demo creados');
  },
};
