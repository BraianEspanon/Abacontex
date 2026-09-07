import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

const CANTIDAD_PEDIDA = 120;

export const pedidosSeed: Seed = {
  name: 'Pedidos demo',

  async run(prisma: PrismaClient) {
    // ==========================================
    // DEMO INNOVASOFT
    // ==========================================

    const empresaInnovaSoft = await prisma.empresa.findUnique({
      where: {
        nombre: 'InnovaSoft',
      },
    });

    if (empresaInnovaSoft) {
      const productoErp = await prisma.producto.findFirst({
        where: {
          empresaId: empresaInnovaSoft.id,
          nombre: 'Licencia ERP',
          activo: true,
        },
      });

      const estadoEnProduccion = await prisma.estadoPedido.findUnique({
        where: {
          nombre: 'EN_PRODUCCION',
        },
      });

      const alumnoInnovaSoft = await prisma.alumno.findFirst({
        where: {
          idEmpresa: empresaInnovaSoft.id,
        },
        include: {
          usuario: true,
        },
      });

      if (productoErp && estadoEnProduccion && alumnoInnovaSoft) {
        const cantidadConStock = Math.min(productoErp.stock, CANTIDAD_PEDIDA);
        const cantidadPendiente = CANTIDAD_PEDIDA - cantidadConStock;

        const precioUnitario = productoErp.precioVenta;
        const precioUnitarioConIva = productoErp.precioConsumidorFinal;

        const subtotal = precioUnitario.mul(CANTIDAD_PEDIDA);
        const subtotalConIva = precioUnitarioConIva.mul(CANTIDAD_PEDIDA);

        const pedidoExistente = await prisma.pedido.findFirst({
          where: {
            empresaId: empresaInnovaSoft.id,
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
              usuarioId: alumnoInnovaSoft.usuario.id,
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
                      productoId: productoErp.id,
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
                    productoId: productoErp.id,
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
              empresaId: empresaInnovaSoft.id,
              usuarioId: alumnoInnovaSoft.usuario.id,
              estadoId: estadoEnProduccion.idEstado,
              clienteNombre: 'Instituto San Martín',
              clienteMail: 'compras@institutosanmartin.edu.ar',
              montoTotal: subtotal,
              montoTotalConIva: subtotalConIva,
              detalles: {
                create: {
                  productoId: productoErp.id,
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
      }
    }

    // ==========================================
    // DEMO LUZ DE LUNA (PRESENTACIÓN)
    // ==========================================

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

    const [veladorEstrellas, veladorIndustrial, estadoCompletado, estadoListo] = await Promise.all([
      prisma.producto.findFirst({
        where: {
          empresaId: luzDeLuna.id,
          nombre: 'Velador estrellas',
          activo: true,
        },
      }),
      prisma.producto.findFirst({
        where: {
          empresaId: luzDeLuna.id,
          nombre: 'Velador estilo industrial',
          activo: true,
        },
      }),
      prisma.estadoPedido.findUnique({
        where: {
          nombre: 'COMPLETADO',
        },
      }),
      prisma.estadoPedido.findUnique({
        where: {
          nombre: 'LISTO_PARA_ENTREGAR',
        },
      }),
    ]);

    if (!veladorEstrellas || !veladorIndustrial || !estadoCompletado || !estadoListo) {
      throw new Error(
        'No se encontraron los datos requeridos para generar los pedidos demo de Luz de luna.'
      );
    }

    // ------------------------------------------
    // PEDIDO #1 (Noel Araoz - COMPLETADO)
    // ------------------------------------------
    const pedido1 = await prisma.pedido.findFirst({
      where: {
        empresaId: luzDeLuna.id,
        clienteMail: 'n.araoz@gmail.com',
      },
    });

    if (pedido1) {
      await prisma.pedido.update({
        where: { idPedido: pedido1.idPedido },
        data: {
          usuarioId: usuarioDemo.id,
          estadoId: estadoCompletado.idEstado,
          clienteNombre: 'Noel Araoz',
          clienteMail: 'n.araoz@gmail.com',
          fecha: new Date('2026-09-07T18:32:27.952Z'),
          montoTotal: 30000,
          montoTotalConIva: 36300,
          detalles: {
            upsert: {
              where: {
                pedidoId_productoId: {
                  pedidoId: pedido1.idPedido,
                  productoId: veladorIndustrial.id,
                },
              },
              update: {
                cantidad: 2,
                cantidadConStock: 2,
                cantidadPendiente: 0,
                precioUnitario: 15000,
                subtotal: 30000,
                precioUnitarioConIva: 18150,
                subtotalConIva: 36300,
              },
              create: {
                productoId: veladorIndustrial.id,
                cantidad: 2,
                cantidadConStock: 2,
                cantidadPendiente: 0,
                precioUnitario: 15000,
                subtotal: 30000,
                precioUnitarioConIva: 18150,
                subtotalConIva: 36300,
              },
            },
          },
        },
      });
    } else {
      await prisma.pedido.create({
        data: {
          empresaId: luzDeLuna.id,
          usuarioId: usuarioDemo.id,
          estadoId: estadoCompletado.idEstado,
          clienteNombre: 'Noel Araoz',
          clienteMail: 'n.araoz@gmail.com',
          fecha: new Date('2026-09-07T18:32:27.952Z'),
          montoTotal: 30000,
          montoTotalConIva: 36300,
          detalles: {
            create: {
              productoId: veladorIndustrial.id,
              cantidad: 2,
              cantidadConStock: 2,
              cantidadPendiente: 0,
              precioUnitario: 15000,
              subtotal: 30000,
              precioUnitarioConIva: 18150,
              subtotalConIva: 36300,
            },
          },
        },
      });
    }

    // ------------------------------------------
    // PEDIDO #2 (Nazarena Bacci - LISTO_PARA_ENTREGAR)
    // ------------------------------------------
    const pedido2 = await prisma.pedido.findFirst({
      where: {
        empresaId: luzDeLuna.id,
        clienteMail: 'n.bacci@gmail.com',
      },
    });

    if (pedido2) {
      await prisma.pedido.update({
        where: { idPedido: pedido2.idPedido },
        data: {
          usuarioId: usuarioDemo.id,
          estadoId: estadoListo.idEstado,
          clienteNombre: 'Nazarena Bacci',
          clienteMail: 'n.bacci@gmail.com',
          fecha: new Date('2026-09-07T18:36:17.142Z'),
          montoTotal: 35000,
          montoTotalConIva: 42350,
          detalles: {
            upsert: [
              {
                where: {
                  pedidoId_productoId: {
                    pedidoId: pedido2.idPedido,
                    productoId: veladorEstrellas.id,
                  },
                },
                update: {
                  cantidad: 1,
                  cantidadConStock: 1,
                  cantidadPendiente: 0,
                  precioUnitario: 20000,
                  subtotal: 20000,
                  precioUnitarioConIva: 24200,
                  subtotalConIva: 24200,
                },
                create: {
                  productoId: veladorEstrellas.id,
                  cantidad: 1,
                  cantidadConStock: 1,
                  cantidadPendiente: 0,
                  precioUnitario: 20000,
                  subtotal: 20000,
                  precioUnitarioConIva: 24200,
                  subtotalConIva: 24200,
                },
              },
              {
                where: {
                  pedidoId_productoId: {
                    pedidoId: pedido2.idPedido,
                    productoId: veladorIndustrial.id,
                  },
                },
                update: {
                  cantidad: 1,
                  cantidadConStock: 1,
                  cantidadPendiente: 0,
                  precioUnitario: 15000,
                  subtotal: 15000,
                  precioUnitarioConIva: 18150,
                  subtotalConIva: 18150,
                },
                create: {
                  productoId: veladorIndustrial.id,
                  cantidad: 1,
                  cantidadConStock: 1,
                  cantidadPendiente: 0,
                  precioUnitario: 15000,
                  subtotal: 15000,
                  precioUnitarioConIva: 18150,
                  subtotalConIva: 18150,
                },
              },
            ],
          },
        },
      });
    } else {
      await prisma.pedido.create({
        data: {
          empresaId: luzDeLuna.id,
          usuarioId: usuarioDemo.id,
          estadoId: estadoListo.idEstado,
          clienteNombre: 'Nazarena Bacci',
          clienteMail: 'n.bacci@gmail.com',
          fecha: new Date('2026-09-07T18:36:17.142Z'),
          montoTotal: 35000,
          montoTotalConIva: 42350,
          detalles: {
            create: [
              {
                productoId: veladorEstrellas.id,
                cantidad: 1,
                cantidadConStock: 1,
                cantidadPendiente: 0,
                precioUnitario: 20000,
                subtotal: 20000,
                precioUnitarioConIva: 24200,
                subtotalConIva: 24200,
              },
              {
                productoId: veladorIndustrial.id,
                cantidad: 1,
                cantidadConStock: 1,
                cantidadPendiente: 0,
                precioUnitario: 15000,
                subtotal: 15000,
                precioUnitarioConIva: 18150,
                subtotalConIva: 18150,
              },
            ],
          },
        },
      });
    }

    console.log('Pedidos demo de Luz de luna creados');
  },
};
