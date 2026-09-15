import { Request, Response } from 'express';
import * as ejercicioService from '../services/ejercicio.service';

export async function digitalizarEjercicio(req: Request, res: Response) {
  const resultado = await ejercicioService.digitalizarEjercicio(req.file);

  res.status(200).json(resultado);
}
