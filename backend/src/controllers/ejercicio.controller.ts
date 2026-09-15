import { Request, Response } from 'express';
import * as ejercicioService from '../services/ejercicio.service';
import { digitalizarEjercicioSchema } from '../validators/ejercicio.validator';

export async function digitalizarEjercicio(req: Request, res: Response) {
  const { body } = digitalizarEjercicioSchema.parse({
    body: req.body,
  });

  const resultado = await ejercicioService.digitalizarEjercicio(req.user!, body, req.file);

  res.status(200).json(resultado);
}
