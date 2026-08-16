import { Prisma } from '@prisma/client';

type VentaPendientePayload = Prisma.VentaGetPayload<{
  include: {
    pedido: {
      select: { clienteNombre: true };
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
}
