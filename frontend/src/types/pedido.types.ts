export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

// Lo que se muestra en la grilla principal
export interface PedidoListado {
  id: number;
  fecha: string;
  cliente: string;
  total: number;
  estado: EstadoPedido;
}

// Lo que va dentro del Detalle del Pedido
export interface PedidoItem {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// El detalle completo al abrir el modal
export interface PedidoDetalle extends PedidoListado {
  items: PedidoItem[];
}

// Paginación y Filtros (Igual que en Productos)
export interface PedidosQueryParams {
  search?: string;
  estado?: EstadoPedido | 'TODOS';
  page?: number;
  pageSize?: number;
}

export interface PedidosResponse {
  items: PedidoListado[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Payload para el formulario de nuevo pedido
export interface CrearPedidoItemPayload {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoPayload {
  cliente: string;
  items: CrearPedidoItemPayload[];
}
