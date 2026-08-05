import { Prisma } from '@prisma/client';

import { ProductoPedido, DetallePedidoCalculado, FaltanteStock } from '../../models/pedido.models';
import { CrearPedidoResponseDTO } from './ped-crear.dto';

type ProductoPrisma = Prisma.ProductoGetPayload<{
  select: {
    id: true;
    nombre: true;
    stock: true;
    precioUnitario: true;
  };
}>;

export function toProductoPedido(producto: ProductoPrisma): ProductoPedido {
  return {
    id: producto.id,
    nombre: producto.nombre,
    stock: producto.stock,
    precioUnitario: producto.precioUnitario,
  };
}

export function toDetalleCalculado(
  producto: ProductoPedido,
  cantidad: number
): DetallePedidoCalculado {
  const cantidadConStock = Math.min(producto.stock, cantidad);
  const cantidadPendiente = Math.max(cantidad - producto.stock, 0);

  return {
    productoId: producto.id,

    cantidad,
    cantidadConStock,
    cantidadPendiente,

    precioUnitario: producto.precioUnitario,
    subtotal: producto.precioUnitario.mul(cantidad),

    stockActual: producto.stock,
  };
}

type PedidoCreado = {
  idPedido: number;
  clienteNombre: string;
  fecha: Date;
  montoTotal: Prisma.Decimal;
  detalles: {
    idDetallePedido: number;
  }[];
};

export function toCrearPedidoResponse(
  pedido: PedidoCreado,
  faltantesStock: FaltanteStock[]
): CrearPedidoResponseDTO {
  return {
    numeroPedido: pedido.idPedido,
    cliente: pedido.clienteNombre,
    fecha: pedido.fecha,
    cantidadProductos: pedido.detalles.length,
    totalEstimado: pedido.montoTotal,
    tieneFaltantesStock: faltantesStock.length > 0,
    faltantesStock,
  };
}
