import { OperacionPendienteItemDTO } from './asiento.dto';

export class AsientoMapper {
  static ventaToPendienteDTO(venta: {
    idVenta: number;
    fecha: Date;
    totalFinal: unknown;
    pedido: { clienteNombre: string };
  }): OperacionPendienteItemDTO {
    return {
      idOrigen: venta.idVenta,
      origen: 'VENTA',
      fecha: venta.fecha,
      concepto: `Venta a ${venta.pedido.clienteNombre}`,
      montoTotal: Number(venta.totalFinal),
    };
  }

  static movimientoToPendienteDTO(movimiento: {
    idMovimiento: number;
    fecha: Date;
    concepto: string;
    importe: unknown;
  }): OperacionPendienteItemDTO {
    return {
      idOrigen: movimiento.idMovimiento,
      origen: 'MOVIMIENTO_FINANCIERO',
      fecha: movimiento.fecha,
      concepto: movimiento.concepto,
      montoTotal: Number(movimiento.importe),
    };
  }

  static conciliacionToPendienteDTO(conciliacion: {
    idConciliacion: number;
    fecha: Date;
    diferencia: unknown;
  }): OperacionPendienteItemDTO {
    const diff = Number(conciliacion.diferencia);
    const concepto = diff < 0 ? 'Faltante de caja' : 'Sobrante de caja';

    return {
      idOrigen: conciliacion.idConciliacion,
      origen: 'CONCILIACION_FINANCIERA',
      fecha: conciliacion.fecha,
      concepto,
      montoTotal: Math.abs(diff),
    };
  }
}
