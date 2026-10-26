import { Request, Response } from 'express';

import * as entregaService from '../services/entrega.service';

import {
  ejercicioIdParamSchema,
  guardarPlantillaAlumnoSchema,
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

export async function guardarPlantilla(req: Request, res: Response) {
  const { params, body } = guardarPlantillaAlumnoSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await entregaService.guardarResolucionPlantilla(
    req.user!,
    params.ejercicioId,
    body
  );

  res.status(200).json(resultado);
}

export async function finalizarEntrega(req: Request, res: Response) {
  const { params } = ejercicioIdParamSchema.parse({
    params: req.params,
  });

  const resultado = await entregaService.finalizarEntrega(req.user!, params.ejercicioId);

  res.status(200).json(resultado);
}

export async function consultarCorreccion(req: Request, res: Response) {
  const { params } = ejercicioIdParamSchema.parse({
    params: req.params,
  });

  const resultado = await entregaService.consultarCorreccionAlumno(req.user!, params.ejercicioId);

  res.status(200).json(resultado);
}
