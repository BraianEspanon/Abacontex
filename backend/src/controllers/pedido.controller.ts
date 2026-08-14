import { Request, Response } from 'express';

import * as pedidoService from '../services/pedido.service';
import { pedidoIdSchema } from '../validators/pedido.validator';

export async function crearPedido(req: Request, res: Response) {
  const pedido = await pedidoService.crearPedido(req.user!, req.body);

  return res.status(201).json(pedido);
}

export async function obtenerPedidos(req: Request, res: Response) {
  const resultado = await pedidoService.obtenerKanbanPedidos(req.user!);

  res.status(200).json(resultado);
}

export async function obtenerDetallePedido(req: Request, res: Response) {
  const params = pedidoIdSchema.parse({
    params: req.params,
  });

  const pedido = await pedidoService.obtenerDetallePedido(req.user!, params.params);

  res.json(pedido);
}

export async function marcarPedidoListoParaEntregar(req: Request, res: Response) {
  const params = pedidoIdSchema.parse({
    params: req.params,
  });

  const resultado = await pedidoService.marcarPedidoListoParaEntregar(req.user!, params.params);

  res.status(200).json(resultado);
}

