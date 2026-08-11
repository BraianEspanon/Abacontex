import { Request, Response } from 'express';

import * as planificacionService from '../services/planificacion.service';
import {
  crearPlanificacionSchema,
  actualizarPlanificacionMensualSchema,
} from '../validators/planificacion.validator';

export async function crearPlanificacion(req: Request, res: Response) {
  const { body } = crearPlanificacionSchema.parse({
    body: req.body,
  });

  const planificacion = await planificacionService.crearPlanificacion(req.user!, body);

  res.status(201).json(planificacion);
}

export async function obtenerPlanificacionAnual(req: Request, res: Response) {
  const resultado = await planificacionService.obtenerPlanificacionAnual(req.user!);

  res.status(200).json(resultado);
}

export async function actualizarPlanificacionMensual(req: Request, res: Response) {
  const { body, params } = actualizarPlanificacionMensualSchema.parse({
    body: req.body,
    params: req.params,
  });

  const resultado = await planificacionService.actualizarPlanificacionMensual(
    req.user!,
    body.unidadesEstimadas,
    params.id
  );

  res.status(200).json(resultado);
}
