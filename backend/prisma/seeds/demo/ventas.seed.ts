import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const ventasSeed: Seed = {
  name: 'Ventas y facturas demo',

  async run(prisma: PrismaClient) {
    const luzDeLuna = await prisma.empresa.findUnique({
      where: {
        nombre: 'Luz de luna',
      },
    });

    const usuarioDemo = await prisma.usuario.findUnique({
      where: {
        email: 'demo@ipgsanmartin.edu.ar',
      },
    });

    if (!luzDeLuna || !usuarioDemo) {
      throw new Error('La empresa o el usuario demo no existen.');
    }

    const pedido1 = await prisma.pedido.findFirst({
      where: {
        empresaId: luzDeLuna.id,
        clienteMail: 'n.araoz@gmail.com',
      },
    });

    const [veladorIndustrial, metodoCredito, categoriaVentas, estadoPendienteMov] =
      await Promise.all([
        prisma.producto.findFirst({
          where: {
            empresaId: luzDeLuna.id,
            nombre: 'Velador estilo industrial',
            activo: true,
          },
        }),
        prisma.metodoPago.findUnique({
          where: {
            nombre: 'Crédito',
          },
        }),
        prisma.categoriaMovimiento.findFirst({
          where: {
            nombre: 'Ventas',
          },
        }),
        prisma.estadoMovimiento.findUnique({
          where: {
            nombre: 'PENDIENTE',
          },
        }),
      ]);

    if (
      !pedido1 ||
      !veladorIndustrial ||
      !metodoCredito ||
      !categoriaVentas ||
      !estadoPendienteMov
    ) {
      throw new Error(
        'No se encontraron los datos requeridos para generar las ventas demo de Luz de luna.'
      );
    }

    // ==========================================
    // VENTA #1 (Asociada al Pedido #1)
    // ==========================================
    const ventaExistente = await prisma.venta.findUnique({
      where: {
        pedidoId: pedido1.idPedido,
      },
    });

    let venta1;

    if (ventaExistente) {
      venta1 = await prisma.venta.update({
        where: {
          idVenta: ventaExistente.idVenta,
        },
        data: {
          empresaId: luzDeLuna.id,
          usuarioId: usuarioDemo.id,
          metodoPagoId: metodoCredito.idMetodoPago,
          estado: 'CONFIRMADA',
          fecha: new Date('2026-09-07T15:33:35.545Z'),
          subtotal: 36300,
          tipoAjuste: 'DESCUENTO',
          porcentajeAjuste: 10,
          importeAjuste: 3630,
          aplicaIva: false,
          importeIva: 0,
          cantidadCuotas: 3,
          porcentajeInteres: 10,
          importeInteres: 3267,
          totalFinal: 35937,
        },
      });
    } else {
      venta1 = await prisma.venta.create({
        data: {
          empresaId: luzDeLuna.id,
          pedidoId: pedido1.idPedido,
          usuarioId: usuarioDemo.id,
          metodoPagoId: metodoCredito.idMetodoPago,
          estado: 'CONFIRMADA',
          fecha: new Date('2026-09-07T15:33:35.545Z'),
          subtotal: 36300,
          tipoAjuste: 'DESCUENTO',
          porcentajeAjuste: 10,
          importeAjuste: 3630,
          aplicaIva: false,
          importeIva: 0,
          cantidadCuotas: 3,
          porcentajeInteres: 10,
          importeInteres: 3267,
          totalFinal: 35937,
          detalles: {
            create: {
              productoId: veladorIndustrial.id,
              cantidad: 2,
              precioUnitario: 18150,
              subtotal: 36300,
            },
          },
        },
      });
    }

    // ==========================================
    // FACTURA #1 (Asociada a Venta #1)
    // ==========================================
    const facturaExistente = await prisma.factura.findUnique({
      where: {
        ventaId: venta1.idVenta,
      },
    });

    if (facturaExistente) {
      await prisma.factura.update({
        where: {
          idFactura: facturaExistente.idFactura,
        },
        data: {
          cai: '96694357259080',
          condicionFiscal: 'CONSUMIDOR_FINAL',
          tipoFactura: 'B',
          fechaEmision: new Date('2026-09-07T15:34:36.304Z'),
          fechaVencimiento: new Date('2026-12-31T00:00:00.000Z'),
          localidad: 'Formosa',
        },
      });
    } else {
      await prisma.factura.create({
        data: {
          ventaId: venta1.idVenta,
          cai: '96694357259080',
          condicionFiscal: 'CONSUMIDOR_FINAL',
          tipoFactura: 'B',
          fechaEmision: new Date('2026-09-07T15:34:36.304Z'),
          fechaVencimiento: new Date('2026-12-31T00:00:00.000Z'),
          localidad: 'Formosa',
        },
      });
    }

    // ==========================================
    // MOVIMIENTO FINANCIERO (Asociado a Venta #1)
    // ==========================================
    const movimientoExistente = await prisma.movimientoFinanciero.findUnique({
      where: {
        ventaId: venta1.idVenta,
      },
    });

    if (movimientoExistente) {
      await prisma.movimientoFinanciero.update({
        where: {
          idMovimiento: movimientoExistente.idMovimiento,
        },
        data: {
          idEmpresa: luzDeLuna.id,
          idUsuario: usuarioDemo.id,
          idCategoria: categoriaVentas.idCategoria,
          idMetodoPago: metodoCredito.idMetodoPago,
          idEstado: estadoPendienteMov.idEstado,
          concepto: `Venta - Pedido #${pedido1.idPedido}`,
          fecha: new Date('2026-09-07T00:00:00.000Z'),
          importe: 35937,
          esAutomatico: true,
        },
      });
    } else {
      await prisma.movimientoFinanciero.create({
        data: {
          idEmpresa: luzDeLuna.id,
          idUsuario: usuarioDemo.id,
          idCategoria: categoriaVentas.idCategoria,
          idMetodoPago: metodoCredito.idMetodoPago,
          idEstado: estadoPendienteMov.idEstado,
          ventaId: venta1.idVenta,
          concepto: `Venta - Pedido #${pedido1.idPedido}`,
          fecha: new Date('2026-09-07T00:00:00.000Z'),
          importe: 35937,
          esAutomatico: true,
        },
      });
    }

    console.log('Venta, Factura y Movimiento Financiero demo creados');
  },
};
