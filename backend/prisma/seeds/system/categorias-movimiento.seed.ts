import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const categoriasMovimientoSeed: Seed = {
  name: 'Categorías de movimiento',

  async run(prisma: PrismaClient) {
    const ingreso = await prisma.tipoMovimiento.findUnique({
      where: {
        nombre: 'INGRESO',
      },
    });

    const egreso = await prisma.tipoMovimiento.findUnique({
      where: {
        nombre: 'EGRESO',
      },
    });

    if (!ingreso || !egreso) {
      throw new Error('No existen los tipos de movimiento INGRESO y EGRESO.');
    }

    await prisma.categoriaMovimiento.createMany({
      data: [
        // =========================
        // INGRESOS
        // =========================
        {
          nombre: 'Ventas',
          descripcion: 'Ingresos generados por ventas realizadas',
          idTipoMovimiento: ingreso.idTipoMovimiento,
        },
        {
          nombre: 'Cobros a clientes',
          descripcion: 'Cobros recibidos de clientes',
          idTipoMovimiento: ingreso.idTipoMovimiento,
        },
        {
          nombre: 'Préstamos recibidos',
          descripcion: 'Ingresos provenientes de préstamos',
          idTipoMovimiento: ingreso.idTipoMovimiento,
        },
        {
          nombre: 'Aportes de capital',
          descripcion: 'Aportes de capital realizados a la empresa',
          idTipoMovimiento: ingreso.idTipoMovimiento,
        },
        {
          nombre: 'Otros ingresos',
          descripcion: 'Otros ingresos no contemplados en las categorías principales',
          idTipoMovimiento: ingreso.idTipoMovimiento,
        },

        // =========================
        // EGRESOS
        // =========================
        {
          nombre: 'Compras de mercadería',
          descripcion: 'Egresos destinados a la compra de mercadería',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
        {
          nombre: 'Pago a proveedores',
          descripcion: 'Pagos realizados a proveedores',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
        {
          nombre: 'Sueldos y jornales',
          descripcion: 'Egresos correspondientes al pago de remuneraciones',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
        {
          nombre: 'Alquileres',
          descripcion: 'Egresos correspondientes al pago de alquileres',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
        {
          nombre: 'Servicios (luz, agua, etc.)',
          descripcion: 'Egresos correspondientes al pago de servicios',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
        {
          nombre: 'Impuestos y tasas',
          descripcion: 'Pagos correspondientes a impuestos y tasas',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
        {
          nombre: 'Amortización de préstamos',
          descripcion: 'Pagos correspondientes a la devolución de préstamos',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
        {
          nombre: 'Inversiones',
          descripcion: 'Egresos destinados a inversiones de la empresa',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
        {
          nombre: 'Otros egresos',
          descripcion: 'Otros egresos no contemplados en las categorías principales',
          idTipoMovimiento: egreso.idTipoMovimiento,
        },
      ],
      skipDuplicates: true,
    });
  },
};
