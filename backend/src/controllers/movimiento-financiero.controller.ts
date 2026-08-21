import { Request, Response } from 'express';

import * as movimientoFinancieroService from '../services/movimiento-financiero.service';
import { registrarMovimientoSchema } from '../validators/movimiento-financiero.validator';

export async function obtenerCategorias(req: Request, res: Response) {
  const resultado = await movimientoFinancieroService.obtenerCategoriasAgrupadas();

  res.status(200).json(resultado);
}

export async function registrarMovimiento(req: Request, res: Response) {
  const { body } = registrarMovimientoSchema.parse({
    body: req.body,
  });

  const resultado = await movimientoFinancieroService.registrarMovimiento(req.user!, body);

  res.status(201).json(resultado);
}
