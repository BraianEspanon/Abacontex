import { Request, Response } from 'express';

import * as planificacionService from '../services/planificacion.service';
import { crearPlanificacionSchema } from '../validators/planificacion.validator';

export async function crearPlanificacion(req: Request, res: Response) {
  const { body } = crearPlanificacionSchema.parse({
    body: req.body,
  });

  const planificacion = await planificacionService.crearPlanificacion(req.user!, body);

  res.status(201).json(planificacion);
}
