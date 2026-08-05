import { Prisma } from '@prisma/client';

import { DetallePedidoResponse, FaltanteStock } from '../../models/pedido.models';

export interface ObtenerDetallePedidoResponseDTO {
  numeroPedido: number;

  cliente: {
    nombre: string;
    mail: string | null;
  };

  estado: string;

  fecha: Date;

  creadoPor: string;

  total: Prisma.Decimal;

  tieneFaltantesStock: boolean;

  faltantesStock: FaltanteStock[];

  detalles: DetallePedidoResponse[];
}
