import { Request, Response } from 'express';

import * as correccionService from '../services/correccion.service';

import {
  entregaIdParamSchema,
  finalizarCorreccionSchema,
  guardarBorradorCorreccionSchema,
  obtenerEjerciciosACorregirQuerySchema,
  obtenerEntregasEjercicioSchema,
  revisarPlantillaSchema,
} from '../validators/correccion.validator';

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

export async function obtenerEntregasEjercicio(req: Request, res: Response) {
  const { params, query } = obtenerEntregasEjercicioSchema.parse({
    params: req.params,
    query: req.query,
  });

  const resultado = await correccionService.obtenerEntregasEjercicio(
    req.user!,
    params.ejercicioId,
    query
  );

  res.status(200).json(resultado);
}

export async function obtenerEspacioTrabajoCorreccion(req: Request, res: Response) {
  const { params } = entregaIdParamSchema.parse({
    params: req.params,
  });

  const resultado = await correccionService.obtenerEspacioTrabajoCorreccion(
    req.user!,
    params.entregaId
  );

  res.status(200).json(resultado);
}

export async function actualizarRevisionPlantilla(req: Request, res: Response) {
  const { params, body } = revisarPlantillaSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await correccionService.actualizarRevisionPlantilla(
    req.user!,
    params.entregaId,
    params.plantillaId,
    body
  );

  res.status(200).json(resultado);
}

export async function guardarBorradorCorreccion(req: Request, res: Response) {
  const { params, body } = guardarBorradorCorreccionSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await correccionService.guardarBorradorCorreccion(
    req.user!,
    params.entregaId,
    body
  );

  res.status(200).json(resultado);
}

export async function finalizarCorreccion(req: Request, res: Response) {
  const { params, body } = finalizarCorreccionSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await correccionService.finalizarCorreccion(req.user!, params.entregaId, body);

  res.status(200).json(resultado);
}
