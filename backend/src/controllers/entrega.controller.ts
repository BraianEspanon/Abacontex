import { Request, Response } from 'express';

import * as entregaService from '../services/entrega.service';

import { obtenerEntregasAlumnoQuerySchema } from '../validators/entrega.validator';

export async function obtenerEntregas(req: Request, res: Response) {
  const { query } = obtenerEntregasAlumnoQuerySchema.parse({
    query: req.query,
  });

  const resultado = await entregaService.obtenerEntregasAlumno(req.user!, query);

  res.status(200).json(resultado);
}
