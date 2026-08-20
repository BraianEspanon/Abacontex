export type EstadoPedido =
  | 'PENDIENTE'
  | 'EN_PRODUCCION'
  | 'LISTO_PARA_ENTREGAR'
  | 'COMPLETADO'
  | 'CANCELADO';

export interface DetallePedidoRequest {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoRequest {
  clienteNombre: string;
  clienteMail: string;
  productos: DetallePedidoRequest[];
}

export interface TarjetaPedido {
  numeroPedido: number;
  cliente: string;
  fecha: string;
  cantidadProductos: number;
  total: number;
  tieneFaltantesStock: boolean;
}

export interface ResumenPedidos {
  total: number;
  pendientes: number;
  enProduccion: number;
  listosParaEntregar: number;
}

export interface KanbanPedidos {
  resumen: ResumenPedidos;
  kanban: {
    PENDIENTE: TarjetaPedido[];
    EN_PRODUCCION: TarjetaPedido[];
    LISTO_PARA_ENTREGAR: TarjetaPedido[];
    COMPLETADO: TarjetaPedido[];
  };
}

export interface FaltanteStock {
  producto: string;
  solicitado: number;
  cubierto: number;
  faltante: number;
}

export interface DetallePedido {
  id: number;
  nombre: string;
  descripcion: string;
  fotoUrl: string | null;
  cantidad: number;
  cantidadConStock: number;
  cantidadPendiente: number;
  precioUnitario: number;
  subtotal: number;

  precioUnitarioConIva?: number;
  subtotalConIva?: number;
}

export interface PedidoDetalle {
  numeroPedido: number;
  cliente: {
    nombre: string;
    mail: string | null;
  };
  estado: EstadoPedido;
  fecha: string;
  creadoPor: string;
  total: number;
  totalConIva?: number;
  tieneFaltantesStock: boolean;
  faltantesStock: FaltanteStock[];
  detalles: DetallePedido[];
}

export interface PedidoCreado {
  numeroPedido: number;
  cliente: string;
  fecha: string;
  cantidadProductos: number;
  totalEstimado: number;
  tieneFaltantesStock: boolean;
  faltantesStock: FaltanteStock[];
}

export interface PedidoCambioEstado {
  numeroPedido: number;
  estado: EstadoPedido;
  mensaje: string;
}

export interface ProductoPedidoSeleccionado {
  id: number;
  nombre: string;
  fotoUrl: string | null;
  precioVenta: number;
  stock: number;
  cantidad: number;
}
