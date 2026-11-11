import { Request, Response } from 'express';

import * as simulacionService from '../services/simulacion.service';

import { crearSimulacionSchema } from '../validators/simulacion.validator';

export async function crearSimulacion(req: Request, res: Response) {
  const { body } = crearSimulacionSchema.parse({
    body: req.body,
  });

  const resultado = await simulacionService.crearSimulacion(req.user!, body);

  res.status(201).json(resultado);
}
