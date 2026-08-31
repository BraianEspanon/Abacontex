import { Request, Response } from 'express';

import * as asientoService from '../services/asiento.service';

export async function obtenerTiposMovimiento(req: Request, res: Response) {
  const resultado = await asientoService.obtenerTiposMovimiento(req.user!);

  res.status(200).json(resultado);
}
