import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

const CANTIDAD_PEDIDA = 120;

export const pedidosSeed: Seed = {
  name: 'Pedidos demo',

  async run(prisma: PrismaClient) {
    // =========================
    // DATOS NECESARIOS
    // =========================

    const empresa = await prisma.empresa.findUnique({
      where: {
        nombre: 'InnovaSoft',
      },
    });

    if (!empresa) {
      throw new Error('La empresa InnovaSoft no existe.');
    }

    const producto = await prisma.producto.findFirst({
      where: {
        empresaId: empresa.id,
        nombre: 'Licencia ERP',
        activo: true,
      },
    });

    if (!producto) {
      throw new Error('El producto Licencia ERP de InnovaSoft no existe.');
    }

    const estadoEnProduccion = await prisma.estadoPedido.findUnique({
      where: {
        nombre: 'EN_PRODUCCION',
      },
    });

    if (!estadoEnProduccion) {
      throw new Error('El estado EN_PRODUCCION no existe.');
    }

    const alumnoEmpresa = await prisma.alumno.findFirst({
      where: {
        idEmpresa: empresa.id,
      },
      include: {
        usuario: true,
      },
    });

    if (!alumnoEmpresa) {
      throw new Error('InnovaSoft no tiene alumnos asignados.');
    }

    // =========================
    // CANTIDADES
    // =========================

    const cantidadConStock = Math.min(producto.stock, CANTIDAD_PEDIDA);

    const cantidadPendiente = CANTIDAD_PEDIDA - cantidadConStock;

    // =========================
    // PRECIOS
    // =========================

    const precioUnitario = producto.precioVenta;
    const precioUnitarioConIva = producto.precioConsumidorFinal;

    const subtotal = precioUnitario.mul(CANTIDAD_PEDIDA);

    const subtotalConIva = precioUnitarioConIva.mul(CANTIDAD_PEDIDA);

    // =========================
    // PEDIDO DEMO
    // =========================

    const pedidoExistente = await prisma.pedido.findFirst({
      where: {
        empresaId: empresa.id,
        clienteMail: 'compras@institutosanmartin.edu.ar',
        clienteNombre: 'Instituto San Martín',
      },
    });

    if (pedidoExistente) {
      await prisma.pedido.update({
        where: {
          idPedido: pedidoExistente.idPedido,
        },
        data: {
          usuarioId: alumnoEmpresa.usuario.id,
          estadoId: estadoEnProduccion.idEstado,

          clienteNombre: 'Instituto San Martín',
          clienteMail: 'compras@institutosanmartin.edu.ar',

          montoTotal: subtotal,
          montoTotalConIva: subtotalConIva,

          detalles: {
            upsert: {
              where: {
                pedidoId_productoId: {
                  pedidoId: pedidoExistente.idPedido,
                  productoId: producto.id,
                },
              },
              update: {
                cantidad: CANTIDAD_PEDIDA,

                cantidadConStock,
                cantidadPendiente,

                precioUnitario,
                subtotal,

                precioUnitarioConIva,
                subtotalConIva,
              },
              create: {
                productoId: producto.id,

                cantidad: CANTIDAD_PEDIDA,

                cantidadConStock,
                cantidadPendiente,

                precioUnitario,
                subtotal,

                precioUnitarioConIva,
                subtotalConIva,
              },
            },
          },
        },
      });
    } else {
      await prisma.pedido.create({
        data: {
          empresaId: empresa.id,
          usuarioId: alumnoEmpresa.usuario.id,
          estadoId: estadoEnProduccion.idEstado,

          clienteNombre: 'Instituto San Martín',
          clienteMail: 'compras@institutosanmartin.edu.ar',

          montoTotal: subtotal,
          montoTotalConIva: subtotalConIva,

          detalles: {
            create: {
              productoId: producto.id,

              cantidad: CANTIDAD_PEDIDA,

              cantidadConStock,
              cantidadPendiente,

              precioUnitario,
              subtotal,

              precioUnitarioConIva,
              subtotalConIva,
            },
          },
        },
      });
    }

    console.log('Pedido demo de InnovaSoft creado');
  },
};
