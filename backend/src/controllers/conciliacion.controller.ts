import { Request, Response } from 'express';

import * as conciliacionService from '../services/conciliacion.service';

export async function obtenerResumen(req: Request, res: Response) {
  const resultado = await conciliacionService.obtenerResumenConciliacion(req.user!);

  res.status(200).json(resultado);
}
