import { Prisma } from '@prisma/client';

export interface ProductoPedido {
  id: number;
  nombre: string;
  stock: number;
  precioVenta: Prisma.Decimal;
}

export interface DetallePedidoCalculado {
  productoId: number;
  cantidad: number;
  precioUnitario: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  stockActual: number;
  cantidadConStock: number;
  cantidadPendiente: number;
}

export interface FaltanteStock {
  producto: string;
  solicitado: number;
  cubierto: number;
  faltante: number;
}

export interface DetallePedidoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  fotoUrl: string | null;

  cantidad: number;
  cantidadConStock: number;
  cantidadPendiente: number;

  precioUnitario: Prisma.Decimal;
  subtotal: Prisma.Decimal;
}
