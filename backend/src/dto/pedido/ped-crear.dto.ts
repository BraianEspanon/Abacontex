import { Prisma } from '@prisma/client';

import { FaltanteStock } from '../../models/pedido.models';

export interface CrearPedidoResponseDTO {
  numeroPedido: number;
  cliente: string;
  fecha: Date;
  cantidadProductos: number;
  totalEstimado: Prisma.Decimal;
  tieneFaltantesStock: boolean;
  faltantesStock: FaltanteStock[];
}
