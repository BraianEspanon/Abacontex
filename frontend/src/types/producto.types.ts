export type EstadoStockProducto = 'TODOS' | 'CON_STOCK' | 'SIN_STOCK';

export type OrdenProductos = 'NOMBRE_ASC' | 'NOMBRE_DESC' | 'STOCK_ASC' | 'STOCK_DESC';

export interface ProductoResumen {
  total: number;
  conStock: number;
  sinStock: number;
  valorEstimado: number;
}

export interface ProductoListado {
  id: number;
  nombre: string;
  fotoUrl: string | null;
  precioUnitario: number;
  precioVenta: number;
  stock: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  margenGanancia: number;
  precioVenta: number;
  stock: number;
  fotoUrl: string | null;
  empresaId: number;
  activo: boolean;
}

export interface ProductosQueryParams {
  search?: string;
  estadoStock?: EstadoStockProducto;
  orden?: OrdenProductos;
  page?: number;
  pageSize?: number;
}

export interface ProductosResponse {
  resumen: ProductoResumen;
  items: ProductoListado[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CrearProductoPayload {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  stockInicial: number;
  margenGanancia: number;
  foto?: File;
}

export interface ActualizarProductoPayload {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  margenGanancia: number;
  foto?: File;
  eliminarFoto?: boolean;
}
