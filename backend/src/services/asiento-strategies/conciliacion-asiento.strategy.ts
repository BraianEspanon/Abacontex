import { Prisma } from '@prisma/client';
import {
  OperacionPendienteStrategy,
  OperacionPendienteContext,
} from './asiento-strategy.interface';
import {
  OperacionPendienteItemDTO,
  DetallePendienteConciliacionDTO,
} from '../../dto/contabilidad/asiento.dto';
import * as asientoRepository from '../../repositories/asiento.repository';
import { NotFoundError } from '../../errors/not-found.error';
import { ConflictError } from '../../errors/conflict.error';
import { ForbiddenError } from '../../errors/forbidden.error';

type ConciliacionPendientePayload = Prisma.PromiseReturnType<
  typeof asientoRepository.findConciliacionesPendientes
>[number];
type ConciliacionPendienteByIdPayload = NonNullable<
  Prisma.PromiseReturnType<typeof asientoRepository.findConciliacionPendienteById>
>;

export class ConciliacionAsientoStrategy implements OperacionPendienteStrategy {
  readonly tipo = 'CONCILIACION_FINANCIERA' as const;

  async getPendientes(ctx: OperacionPendienteContext): Promise<OperacionPendienteItemDTO[]> {
    if (!ctx.esSextoAño) {
      return [];
    }

    const conciliaciones = await asientoRepository.findConciliacionesPendientes(ctx.empresaId);
    return conciliaciones.map((c) => this.toPendienteDTO(c));
  }

  async getDetalle(
    id: number,
    ctx: OperacionPendienteContext
  ): Promise<DetallePendienteConciliacionDTO> {
    if (!ctx.esSextoAño) {
      throw new ForbiddenError(
        'Las conciliaciones financieras solo corresponden a alumnos de 6° año.'
      );
    }

    const conciliacion = await asientoRepository.findConciliacionPendienteById(id, ctx.empresaId);

    if (!conciliacion) {
      throw new NotFoundError(
        'La conciliación financiera solicitada no existe o no pertenece a tu empresa.'
      );
    }

    if (conciliacion.asientoContable) {
      throw new ConflictError(
        'Esta conciliación financiera ya posee un asiento contable registrado en el Libro Diario.'
      );
    }

    if (Number(conciliacion.diferencia) === 0) {
      throw new ConflictError('La conciliación elegida no registró una diferencia.');
    }

    return this.toDetallePendienteDTO(conciliacion);
  }

  async getDetalleOperacion(
    id: number,
    ctx: OperacionPendienteContext
  ): Promise<DetallePendienteConciliacionDTO> {
    if (!ctx.esSextoAño) {
      throw new ForbiddenError(
        'Las conciliaciones financieras solo corresponden a alumnos de 6° año.'
      );
    }

    const conciliacion = await asientoRepository.findConciliacionPendienteById(id, ctx.empresaId);

    if (!conciliacion) {
      throw new NotFoundError(
        'La conciliación financiera solicitada no existe o no pertenece a tu empresa.'
      );
    }

    return this.toDetallePendienteDTO(conciliacion);
  }

  private toPendienteDTO(conciliacion: ConciliacionPendientePayload): OperacionPendienteItemDTO {
    const diff = Number(conciliacion.diferencia);
    const concepto = diff < 0 ? 'Faltante de caja' : 'Sobrante de caja';

    return {
      id: conciliacion.idConciliacion,
      tipo: 'CONCILIACION_FINANCIERA',
      fecha: conciliacion.fecha,
      concepto,
      montoTotal: Math.abs(diff),
    };
  }

  private toDetallePendienteDTO(
    conciliacion: ConciliacionPendienteByIdPayload
  ): DetallePendienteConciliacionDTO {
    return {
      tipo: 'CONCILIACION_FINANCIERA',
      idConciliacion: conciliacion.idConciliacion,
      fecha: conciliacion.fecha,
      saldoEsperado: Number(conciliacion.saldoEsperado),
      saldoContado: Number(conciliacion.saldoContado),
      diferencia: Number(conciliacion.diferencia),
      observacion: conciliacion.observacion,
    };
  }

  async validarYObtenerFecha(
    id: number,
    ctx: OperacionPendienteContext,
    tx?: Prisma.TransactionClient
  ) {
    if (!ctx.esSextoAño) {
      throw new ForbiddenError(
        'Las conciliaciones financieras solo corresponden a alumnos de 6° año.'
      );
    }

    const conciliacion = await asientoRepository.findConciliacionPendienteById(
      id,
      ctx.empresaId,
      tx
    );

    if (!conciliacion) {
      throw new NotFoundError(
        'La conciliación financiera solicitada no existe o no pertenece a tu empresa.'
      );
    }

    if (conciliacion.asientoContable) {
      throw new ConflictError(
        'Esta conciliación financiera ya posee un asiento contable registrado en el Libro Diario.'
      );
    }

    if (Number(conciliacion.diferencia) === 0) {
      throw new ConflictError('La conciliación elegida no registró una diferencia.');
    }

    return { fecha: conciliacion.fecha, conciliacionId: conciliacion.idConciliacion };
  }
}
