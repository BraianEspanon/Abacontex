import { Request, Response } from 'express';

import * as ventaService from '../services/venta.service';

export async function obtenerPedidosListos(req: Request, res: Response) {
  const resultado = await ventaService.obtenerPedidosListos(req.user!);

  res.status(200).json(resultado);
}
