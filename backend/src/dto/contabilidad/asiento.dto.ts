export interface OperacionPendienteItemDTO {
  idOrigen: number;
  origen: 'VENTA' | 'MOVIMIENTO_FINANCIERO' | 'CONCILIACION_FINANCIERA';
  fecha: Date;
  concepto: string;
  montoTotal: number;
}
