import { Prisma } from '@prisma/client';
import {
  OperacionPendienteStrategy,
  OperacionPendienteContext,
} from './asiento-strategy.interface';
import {
  OperacionPendienteItemDTO,
  DetallePendienteVentaDTO,
} from '../../dto/contabilidad/asiento.dto';
import * as asientoRepository from '../../repositories/asiento.repository';
import { NotFoundError } from '../../errors/not-found.error';
import { ConflictError } from '../../errors/conflict.error';

type VentaPendientePayload = Prisma.PromiseReturnType<
  typeof asientoRepository.findVentasPendientes
>[number];
type VentaPendienteByIdPayload = NonNullable<
  Prisma.PromiseReturnType<typeof asientoRepository.findVentaPendienteById>
>;

export class VentaAsientoStrategy implements OperacionPendienteStrategy {
  readonly tipo = 'VENTA' as const;

  async getPendientes(ctx: OperacionPendienteContext): Promise<OperacionPendienteItemDTO[]> {
    const ventas = await asientoRepository.findVentasPendientes(ctx.empresaId);
    return ventas.map((v) => this.toPendienteDTO(v));
  }

  async getDetalle(id: number, ctx: OperacionPendienteContext): Promise<DetallePendienteVentaDTO> {
    const venta = await asientoRepository.findVentaPendienteById(id, ctx.empresaId);

    if (!venta) {
      throw new NotFoundError('La venta solicitada no existe o no pertenece a tu empresa.');
    }

    if (venta.asientoContable) {
      throw new ConflictError(
        'Esta venta ya posee un asiento contable registrado en el Libro Diario.'
      );
    }

    return this.toDetallePendienteDTO(venta, ctx.esSextoAño);
  }

  async getDetalleOperacion(
    id: number,
    ctx: OperacionPendienteContext
  ): Promise<DetallePendienteVentaDTO> {
    const venta = await asientoRepository.findVentaPendienteById(id, ctx.empresaId);

    if (!venta) {
      throw new NotFoundError('La venta solicitada no existe o no pertenece a tu empresa.');
    }

    return this.toDetallePendienteDTO(venta, ctx.esSextoAño);
  }

  private toPendienteDTO(venta: VentaPendientePayload): OperacionPendienteItemDTO {
    return {
      id: venta.idVenta,
      tipo: 'VENTA',
      fecha: venta.fecha,
      concepto: `Venta a ${venta.pedido.clienteNombre}`,
      montoTotal: Number(venta.totalFinal),
    };
  }

  private toDetallePendienteDTO(
    venta: VentaPendienteByIdPayload,
    esSextoAño: boolean
  ): DetallePendienteVentaDTO {
    const dto: DetallePendienteVentaDTO = {
      tipo: 'VENTA',
      idVenta: venta.idVenta,
      pedidoId: venta.pedidoId,
      fecha: venta.fecha,
      estado: venta.estado,
      clienteNombre: venta.pedido.clienteNombre,
      clienteMail: venta.pedido.clienteMail,
      formaPago: venta.metodoPago.nombre,
      aplicaAjuste: venta.tipoAjuste !== 'NINGUNO',
      tipoAjuste: venta.tipoAjuste,
      porcentajeAjuste: Number(venta.porcentajeAjuste),
      importeAjuste: Number(venta.importeAjuste),
      aplicaIva: venta.aplicaIva,
      importeIva: Number(venta.importeIva),
      cantidadCuotas: venta.cantidadCuotas,
      porcentajeInteres: Number(venta.porcentajeInteres),
      importeInteres: Number(venta.importeInteres),
      subtotal: Number(venta.subtotal),
      totalFinal: Number(venta.totalFinal),
    };

    if (esSextoAño && venta.detalles) {
      dto.productos = venta.detalles.map((d) => ({
        productoId: d.productoId,
        nombre: d.producto.nombre,
        cantidad: d.cantidad,
        precioUnitarioCosto: Number(d.producto.precioUnitario),
      }));
    }

    return dto;
  }

  async validarYObtenerFecha(
    id: number,
    ctx: OperacionPendienteContext,
    tx?: Prisma.TransactionClient
  ) {
    const venta = await asientoRepository.findVentaPendienteById(id, ctx.empresaId, tx);

    if (!venta) {
      throw new NotFoundError('La venta solicitada no existe o no pertenece a tu empresa.');
    }

    if (venta.asientoContable) {
      throw new ConflictError(
        'Esta venta ya posee un asiento contable registrado en el Libro Diario.'
      );
    }

    return { fecha: venta.fecha, ventaId: venta.idVenta };
  }
}
