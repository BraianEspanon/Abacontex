import { Prisma } from '@prisma/client';

export type HistorialMovimientoPayload = Prisma.MovimientoFinancieroGetPayload<{
  select: {
    idMovimiento: true;
    fecha: true;
    concepto: true;
    importe: true;
    categoria: {
      select: {
        nombre: true;
        tipoMovimiento: { select: { nombre: true; idTipoMovimiento: true } };
      };
    };
    metodoPago: { select: { nombre: true } };
  };
}>;

export class MovimientoFinancieroMapper {
  static toHistorialDTO(movimiento: HistorialMovimientoPayload) {
    return {
      idMovimiento: movimiento.idMovimiento,
      fecha: movimiento.fecha,
      concepto: movimiento.concepto,
      importe: Number(movimiento.importe),
      categoria: movimiento.categoria.nombre,
      tipoMovimiento: movimiento.categoria.tipoMovimiento.nombre,
      idTipoMovimiento: movimiento.categoria.tipoMovimiento.idTipoMovimiento,
      metodoPago: movimiento.metodoPago.nombre,
    };
  }
}
