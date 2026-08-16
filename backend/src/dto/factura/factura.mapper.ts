import { Prisma } from '@prisma/client';

type VentaPendientePayload = Prisma.VentaGetPayload<{
  include: {
    pedido: {
      select: { clienteNombre: true };
    };
  };
}>;

export type FacturaDetallePayload = Prisma.FacturaGetPayload<{
  include: {
    venta: {
      include: {
        empresa: {
          select: { nombre: true; fechaCreacion: true };
        };
        pedido: {
          select: { clienteNombre: true; clienteMail: true };
        };
        metodoPago: {
          select: { nombre: true };
        };
        detalles: {
          include: {
            producto: {
              select: { nombre: true };
            };
          };
        };
      };
    };
  };
}>;

export class FacturaMapper {
  static toVentaPendienteDTO(venta: VentaPendientePayload) {
    return {
      idVenta: venta.idVenta,
      cliente: venta.pedido.clienteNombre,
      montoTotal: Number(venta.totalFinal),
    };
  }

  static toFacturaDetalleDTO(factura: FacturaDetallePayload) {
    const { venta } = factura;

    return {
      idFactura: factura.idFactura,
      tipoFactura: factura.tipoFactura,
      fechaEmision: factura.fechaEmision,

      empresa: {
        nombre: venta.empresa.nombre,
        fechaCreacion: venta.empresa.fechaCreacion,
      },

      cliente: {
        nombre: venta.pedido.clienteNombre,
        email: venta.pedido.clienteMail,
        condicionFiscal: factura.condicionFiscal,
      },

      condicionVenta: venta.metodoPago.nombre,

      detalles: venta.detalles.map((detalle) => ({
        cantidad: detalle.cantidad,
        detalle: detalle.producto.nombre,
        precioUnitario: Number(detalle.precioUnitario),
        importe: Number(detalle.subtotal),
      })),

      totales: {
        netoGravado: Number(venta.subtotal),

        tipoAjuste: venta.tipoAjuste,
        porcentajeAjuste: Number(venta.porcentajeAjuste),
        importeAjuste: Number(venta.importeAjuste),

        porcentajeInteres: Number(venta.porcentajeInteres),
        importeInteres: Number(venta.importeInteres),

        porcentajeIva: venta.aplicaIva ? 21 : 0,
        importeIva: Number(venta.importeIva),

        totalFinal: Number(venta.totalFinal),
      },
    };
  }
}
