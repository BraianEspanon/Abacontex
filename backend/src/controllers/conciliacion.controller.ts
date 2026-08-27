import { Request, Response } from 'express';

import * as conciliacionService from '../services/conciliacion.service';
import {
  registrarConciliacionSchema,
  consultarHistorialConciliacionesSchema,
} from '../validators/conciliacion.validator';

export async function obtenerResumen(req: Request, res: Response) {
  const resultado = await conciliacionService.obtenerResumenConciliacion(req.user!);

  res.status(200).json(resultado);
}

export async function registrar(req: Request, res: Response) {
  const { body } = registrarConciliacionSchema.parse({
    body: req.body,
  });

  const resultado = await conciliacionService.registrarConciliacion(req.user!, body);

  res.status(201).json(resultado);
}

export async function obtenerHistorial(req: Request, res: Response) {
  const { query } = consultarHistorialConciliacionesSchema.parse({
    query: req.query,
  });

  const resultado = await conciliacionService.obtenerHistorial(req.user!, query);

  res.status(200).json(resultado);
}
