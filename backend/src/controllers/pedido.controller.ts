import { Request, Response } from 'express';

import { crearPedido as crearPedidoService } from '../services/pedido.service';

export async function crearPedido(req: Request, res: Response) {
  const pedido = await crearPedidoService(req.user!, req.body);

  return res.status(201).json(pedido);
}
