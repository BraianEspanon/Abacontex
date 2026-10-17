import { Request, Response } from 'express';

import * as entregaService from '../services/entrega.service';

import {
  ejercicioIdParamSchema,
  obtenerEntregasAlumnoQuerySchema,
} from '../validators/entrega.validator';

export async function obtenerEntregas(req: Request, res: Response) {
  const { query } = obtenerEntregasAlumnoQuerySchema.parse({
    query: req.query,
  });

  const resultado = await entregaService.obtenerEntregasAlumno(req.user!, query);

  res.status(200).json(resultado);
}

export async function obtenerFiltrosTablero(req: Request, res: Response) {
  const resultado = await entregaService.obtenerFiltrosTablero(req.user!);

  res.status(200).json(resultado);
}

export async function obtenerDetalleEjercicio(req: Request, res: Response) {
  const { params } = ejercicioIdParamSchema.parse({
    params: req.params,
  });

  const resultado = await entregaService.obtenerDetalleEjercicio(req.user!, params.ejercicioId);

  res.status(200).json(resultado);
}

export async function consultarResolucion(req: Request, res: Response) {
  const { params } = ejercicioIdParamSchema.parse({
    params: req.params,
  });

  const resultado = await entregaService.consultarResolucionAlumno(req.user!, params.ejercicioId);

  res.status(200).json(resultado);
}
