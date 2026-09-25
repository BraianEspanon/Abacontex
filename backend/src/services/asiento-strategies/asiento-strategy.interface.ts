import { Prisma } from '@prisma/client';
import {
  OperacionPendienteItemDTO,
  DetallePendienteResponseDTO,
} from '../../dto/contabilidad/asiento.dto';

export interface OperacionPendienteContext {
  empresaId: number;
  esSextoAño: boolean;
}

export interface ValidacionOperacionResultado {
  fecha: Date;
  ventaId?: number;
  movimientoFinancieroId?: number;
  conciliacionId?: number;
}

export interface OperacionPendienteStrategy {
  readonly tipo: 'VENTA' | 'MOVIMIENTO_FINANCIERO' | 'CONCILIACION_FINANCIERA';

  getPendientes(ctx: OperacionPendienteContext): Promise<OperacionPendienteItemDTO[]>;

  getDetalle(id: number, ctx: OperacionPendienteContext): Promise<DetallePendienteResponseDTO>;

  getDetalleOperacion(
    id: number,
    ctx: OperacionPendienteContext
  ): Promise<DetallePendienteResponseDTO>;

  validarYObtenerFecha(
    id: number,
    ctx: OperacionPendienteContext,
    tx?: Prisma.TransactionClient
  ): Promise<ValidacionOperacionResultado>;
}
