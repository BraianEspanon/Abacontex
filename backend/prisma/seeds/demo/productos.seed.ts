import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

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

    await prisma.producto.upsert({
      where: {
        empresaId_nombre: {
          empresaId: techNova.id,
          nombre: 'Notebook',
        },
      },
      update: {
        descripcion: 'Notebook para oficina',
        stock: 15,
        precioUnitario: 700000,
        fotoUrl: null,
        activo: true,
      },
      create: {
        empresaId: techNova.id,
        nombre: 'Notebook',
        descripcion: 'Notebook para oficina',
        stock: 15,
        precioUnitario: 700000,
        fotoUrl: null,
        activo: true,
      },
    });

    await prisma.producto.upsert({
      where: {
        empresaId_nombre: {
          empresaId: techNova.id,
          nombre: 'Mouse inalámbrico',
        },
      },
      update: {
        descripcion: 'Mouse óptico inalámbrico',
        stock: 40,
        precioUnitario: 18000,
        fotoUrl: null,
        activo: true,
      },
      create: {
        empresaId: techNova.id,
        nombre: 'Mouse inalámbrico',
        descripcion: 'Mouse óptico inalámbrico',
        stock: 40,
        precioUnitario: 18000,
        fotoUrl: null,
        activo: true,
      },
    });

    // ==========================
    // INNOVASOFT
    // ==========================

    await prisma.producto.upsert({
      where: {
        empresaId_nombre: {
          empresaId: innovaSoft.id,
          nombre: 'Licencia ERP',
        },
      },
      update: {
        descripcion: 'Licencia anual del sistema',
        stock: 100,
        precioUnitario: 50000,
        fotoUrl: null,
        activo: true,
      },
      create: {
        empresaId: innovaSoft.id,
        nombre: 'Licencia ERP',
        descripcion: 'Licencia anual del sistema',
        stock: 100,
        precioUnitario: 50000,
        fotoUrl: null,
        activo: true,
      },
    });

    console.log('Productos demo creados');
  },
};
