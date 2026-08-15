import { Request, Response } from 'express';

import * as metodoPagoService from '../services/metodo-pago.service';

export async function obtenerMetodosPagoDisponibles(req: Request, res: Response) {
  const resultado = await metodoPagoService.obtenerMetodosPagoDisponibles(req.user!);

  res.status(200).json(resultado);
}
