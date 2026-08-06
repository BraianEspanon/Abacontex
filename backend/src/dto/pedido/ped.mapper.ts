import { Prisma } from '@prisma/client';

import {
  ProductoPedido,
  DetallePedidoCalculado,
  FaltanteStock,
  DetallePedidoResponse,
} from '../../models/pedido.models';
import { CrearPedidoResponseDTO } from './ped-crear.dto';
import { ObtenerDetallePedidoResponseDTO } from './ped-detalle.dto';
import { KanbanPedidosResponseDTO, TarjetaPedidoDTO } from './ped-kanban.dto';

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
type DetallePedidoConProducto = {
  cantidad: number;
  cantidadConStock: number;
  cantidadPendiente: number;

  precioUnitario: Prisma.Decimal;
  subtotal: Prisma.Decimal;

  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    fotoUrl: string | null;
  };
};

type PedidoDetalle = {
  idPedido: number;

  clienteNombre: string;
  clienteMail: string | null;

  fecha: Date;

  montoTotal: Prisma.Decimal;

  estado: {
    nombre: string;
  };

  usuario: {
    nombre: string;
    apellido: string;
  };

  detalles: DetallePedidoConProducto[];
};

export function toDetalleProductoResponse(
  detalle: DetallePedidoConProducto
): DetallePedidoResponse {
  return {
    id: detalle.producto.id,
    nombre: detalle.producto.nombre,
    descripcion: detalle.producto.descripcion,
    fotoUrl: detalle.producto.fotoUrl,

    cantidad: detalle.cantidad,
    cantidadConStock: detalle.cantidadConStock,
    cantidadPendiente: detalle.cantidadPendiente,

    precioUnitario: detalle.precioUnitario,
    subtotal: detalle.subtotal,
  };
}

export function toObtenerDetallePedidoResponse(
  pedido: PedidoDetalle
): ObtenerDetallePedidoResponseDTO {
  const faltantesStock: FaltanteStock[] = pedido.detalles
    .filter((d) => d.cantidadPendiente > 0)
    .map((d) => ({
      producto: d.producto.nombre,
      solicitado: d.cantidad,
      cubierto: d.cantidadConStock,
      faltante: d.cantidadPendiente,
    }));

  return {
    numeroPedido: pedido.idPedido,

    cliente: {
      nombre: pedido.clienteNombre,
      mail: pedido.clienteMail,
    },

    estado: pedido.estado.nombre,

    fecha: pedido.fecha,

    creadoPor: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`,

    total: pedido.montoTotal,

    tieneFaltantesStock: faltantesStock.length > 0,

    faltantesStock,

    detalles: pedido.detalles.map(toDetalleProductoResponse),
  };
}

type PedidoKanban = Prisma.PedidoGetPayload<{
  include: {
    estado: {
      select: {
        nombre: true;
      };
    };
    detalles: {
      select: {
        cantidadPendiente: true;
      };
    };
  };
}>;

export function toKanbanPedidosResponse(pedidos: PedidoKanban[]): KanbanPedidosResponseDTO {
  const response: KanbanPedidosResponseDTO = {
    resumen: {
      total: pedidos.length,
      pendientes: 0,
      enProduccion: 0,
      listosParaEntregar: 0,
    },

    kanban: {
      PENDIENTE: [],
      EN_PRODUCCION: [],
      LISTO_PARA_ENTREGAR: [],
      COMPLETADO: [],
    },
  };

  for (const pedido of pedidos) {
    const tarjeta: TarjetaPedidoDTO = {
      numeroPedido: pedido.idPedido,
      cliente: pedido.clienteNombre,
      fecha: pedido.fecha,
      cantidadProductos: pedido.detalles.length,
      total: pedido.montoTotal,
      tieneFaltantesStock: pedido.detalles.some((detalle) => detalle.cantidadPendiente > 0),
    };

    switch (pedido.estado.nombre) {
      case 'PENDIENTE':
        response.resumen.pendientes++;
        response.kanban.PENDIENTE.push(tarjeta);
        break;

      case 'EN_PRODUCCION':
        response.resumen.enProduccion++;
        response.kanban.EN_PRODUCCION.push(tarjeta);
        break;

      case 'LISTO_PARA_ENTREGAR':
        response.resumen.listosParaEntregar++;
        response.kanban.LISTO_PARA_ENTREGAR.push(tarjeta);
        break;

      case 'COMPLETADO':
        response.kanban.COMPLETADO.push(tarjeta);
        break;
    }
  }

  return response;
}
