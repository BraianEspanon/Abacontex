import { Request, Response } from 'express';

import * as asientoService from '../services/asiento.service';

import { obtenerPendientesSchema } from '../validators/asiento.validator';

export async function obtenerTiposMovimiento(req: Request, res: Response) {
  const resultado = await asientoService.obtenerTiposMovimiento(req.user!);

  res.status(200).json(resultado);
}

export async function obtenerPendientes(req: Request, res: Response) {
  const { query } = obtenerPendientesSchema.parse({
    query: req.query,
  });

  const resultado = await asientoService.obtenerPendientes(req.user!, query);

  res.status(200).json(resultado);
}
