import { Prisma } from '@prisma/client';
import {
  OperacionPendienteStrategy,
  OperacionPendienteContext,
} from './asiento-strategy.interface';
import {
  OperacionPendienteItemDTO,
  DetallePendienteMovimientoDTO,
} from '../../dto/contabilidad/asiento.dto';
import * as asientoRepository from '../../repositories/asiento.repository';
import { NotFoundError } from '../../errors/not-found.error';
import { ConflictError } from '../../errors/conflict.error';

type MovimientoPendientePayload = Prisma.PromiseReturnType<
  typeof asientoRepository.findMovimientosPendientes
>[number];
type MovimientoPendienteByIdPayload = NonNullable<
  Prisma.PromiseReturnType<typeof asientoRepository.findMovimientoPendienteById>
>;

export class MovimientoAsientoStrategy implements OperacionPendienteStrategy {
  readonly tipo = 'MOVIMIENTO_FINANCIERO' as const;

  async getPendientes(ctx: OperacionPendienteContext): Promise<OperacionPendienteItemDTO[]> {
    const movimientos = await asientoRepository.findMovimientosPendientes(ctx.empresaId);
    return movimientos.map((m) => this.toPendienteDTO(m));
  }

  async getDetalle(
    id: number,
    ctx: OperacionPendienteContext
  ): Promise<DetallePendienteMovimientoDTO> {
    const movimiento = await asientoRepository.findMovimientoPendienteById(id, ctx.empresaId);

    if (!movimiento) {
      throw new NotFoundError(
        'El movimiento financiero solicitado no existe o no pertenece a tu empresa.'
      );
    }

    if (movimiento.asientoContable) {
      throw new ConflictError(
        'Este movimiento financiero ya posee un asiento contable registrado en el Libro Diario.'
      );
    }

    return this.toDetallePendienteDTO(movimiento);
  }

  private toPendienteDTO(movimiento: MovimientoPendientePayload): OperacionPendienteItemDTO {
    return {
      id: movimiento.idMovimiento,
      tipo: 'MOVIMIENTO_FINANCIERO',
      fecha: movimiento.fecha,
      concepto: movimiento.concepto,
      montoTotal: Number(movimiento.importe),
    };
  }

  private toDetallePendienteDTO(
    movimiento: MovimientoPendienteByIdPayload
  ): DetallePendienteMovimientoDTO {
    return {
      tipo: 'MOVIMIENTO_FINANCIERO',
      idMovimiento: movimiento.idMovimiento,
      fecha: movimiento.fecha,
      tipoMovimiento: movimiento.categoria.tipoMovimiento.nombre,
      categoria: movimiento.categoria.nombre,
      concepto: movimiento.concepto,
      importe: Number(movimiento.importe),
      medioPago: movimiento.metodoPago.nombre,
    };
  }
}
