import { z } from 'zod';

// ==========================================================
// 1. ESQUEMAS DE VALIDACIÓN (ZOD) PARA EL FORMULARIO
// ==========================================================

export const detallePedidoRequestSchema = z.object({
  productoId: z.number(),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a cero'),
  // Campos auxiliares para la UI (no se envían al backend en el submit final,
  // pero los necesitamos para renderizar la tabla y calcular totales)
  nombre: z.string(),
  descripcion: z.string(),
  codigo: z.string().optional(),
  fotoUrl: z.string().nullable(),
  precioUnitario: z.number(),
  stock: z.number(),
});

export const pedidoCrearRequestSchema = z.object({
  clienteNombre: z.string().min(2, 'El nombre del cliente es obligatorio'),
  clienteMail: z.string().email('Ingresá un correo electrónico válido'),
  productos: z
    .array(detallePedidoRequestSchema)
    .min(1, 'Debes agregar al menos un producto al pedido'),
});

// Tipos inferidos para React Hook Form
export type PedidoCrearFormData = z.infer<typeof pedidoCrearRequestSchema>;
export type DetallePedidoUI = z.infer<typeof detallePedidoRequestSchema>;

// ==========================================================
// 2. INTERFACES DE RESPUESTA DE LA API (DTOs)
// ==========================================================

export interface FaltanteStock {
  producto: string;
  solicitado: number;
  cubierto: number;
  faltante: number;
}

export interface PedidoCreado {
  numeroPedido: number;
  cliente: string;
  fecha: string; // ISO String
  cantidadProductos: number;
  totalEstimado: number;
  tieneFaltantesStock: boolean;
  faltantesStock?: FaltanteStock[];
}

// Interfaces para la vista del Tablero Kanban (HU 5.3)
export interface TarjetaPedido {
  numeroPedido: number;
  cliente: string;
  fecha: string; // ISO String
  cantidadProductos: number;
  total: number;
  tieneFaltantesStock: boolean;
}

export interface KanbanPedidos {
  resumen: {
    total: number;
    pendientes: number;
    enProduccion: number;
    listosParaEntregar: number;
  };
  kanban: {
    PENDIENTE: TarjetaPedido[];
    EN_PRODUCCION: TarjetaPedido[];
    LISTO_PARA_ENTREGAR: TarjetaPedido[];
    COMPLETADO: TarjetaPedido[];
  };
}
