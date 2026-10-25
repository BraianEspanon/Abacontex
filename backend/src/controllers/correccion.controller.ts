import { Request, Response } from 'express';

import * as correccionService from '../services/correccion.service';

import { obtenerEjerciciosACorregirQuerySchema } from '../validators/correccion.validator';

export async function obtenerEjerciciosACorregir(req: Request, res: Response) {
  const { query } = obtenerEjerciciosACorregirQuerySchema.parse({
    query: req.query,
  });

  const resultado = await correccionService.obtenerEjerciciosACorregir(req.user!, query);

  res.status(200).json(resultado);
}

export async function obtenerFiltrosTablero(req: Request, res: Response) {
  const resultado = await correccionService.obtenerFiltrosTableroCorreccion(req.user!);

  res.status(200).json(resultado);
}
