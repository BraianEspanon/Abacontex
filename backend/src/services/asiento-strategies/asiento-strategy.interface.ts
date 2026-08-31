import {
  OperacionPendienteItemDTO,
  DetallePendienteResponseDTO,
} from '../../dto/contabilidad/asiento.dto';

export interface OperacionPendienteContext {
  empresaId: number;
  esSextoAño: boolean;
}

export interface OperacionPendienteStrategy {
  readonly tipo: 'VENTA' | 'MOVIMIENTO_FINANCIERO' | 'CONCILIACION_FINANCIERA';

  getPendientes(ctx: OperacionPendienteContext): Promise<OperacionPendienteItemDTO[]>;

  getDetalle(id: number, ctx: OperacionPendienteContext): Promise<DetallePendienteResponseDTO>;
}
