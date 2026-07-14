import { PrismaClient } from '@prisma/client';
import type { Seed } from '../types';

export const productosSeed: Seed = {
  name: 'Productos',

  async run(prisma: PrismaClient) {
    const techNova = await prisma.empresa.findUnique({
      where: { nombre: 'TechNova' },
    });

    const innovaSoft = await prisma.empresa.findUnique({
      where: { nombre: 'InnovaSoft' },
    });

    if (!techNova || !innovaSoft) {
      throw new Error('Las empresas de demo no existen.');
    }

    // ==========================
    // TECHNOVA
    // ==========================

    await prisma.producto.upsert({
      where: {
        empresaId_codigo: {
          empresaId: techNova.id,
          codigo: 'P001',
        },
      },
      update: {},
      create: {
        empresaId: techNova.id,
        codigo: 'P001',
        nombre: 'Notebook',
        descripcion: 'Notebook para oficina',
        stock: 15,
        costoUnitario: 550000,
        precioVenta: 700000,
      },
    });

    await prisma.producto.upsert({
      where: {
        empresaId_codigo: {
          empresaId: techNova.id,
          codigo: 'P002',
        },
      },
      update: {},
      create: {
        empresaId: techNova.id,
        codigo: 'P002',
        nombre: 'Mouse inalámbrico',
        descripcion: 'Mouse óptico inalámbrico',
        stock: 40,
        costoUnitario: 12000,
        precioVenta: 18000,
      },
    });

    // ==========================
    // INNOVASOFT
    // ==========================

    await prisma.producto.upsert({
      where: {
        empresaId_codigo: {
          empresaId: innovaSoft.id,
          codigo: 'P001',
        },
      },
      update: {},
      create: {
        empresaId: innovaSoft.id,
        codigo: 'P001',
        nombre: 'Licencia ERP',
        descripcion: 'Licencia anual del sistema',
        stock: 100,
        costoUnitario: 30000,
        precioVenta: 50000,
      },
    });

    console.log('Productos creados');
  },
};
