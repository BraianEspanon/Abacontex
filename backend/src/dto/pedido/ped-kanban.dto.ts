import { Prisma } from '@prisma/client';

export interface TarjetaPedidoDTO {
  numeroPedido: number;
  cliente: string;
  fecha: Date;
  cantidadProductos: number;
  total: Prisma.Decimal;
  tieneFaltantesStock: boolean;
}

export interface ResumenKanbanDTO {
  total: number;
  pendientes: number;
  enProduccion: number;
  listosParaEntregar: number;
}

export interface KanbanPedidosResponseDTO {
  resumen: ResumenKanbanDTO;

  kanban: {
    PENDIENTE: TarjetaPedidoDTO[];
    EN_PRODUCCION: TarjetaPedidoDTO[];
    LISTO_PARA_ENTREGAR: TarjetaPedidoDTO[];
    COMPLETADO: TarjetaPedidoDTO[];
  };
}
