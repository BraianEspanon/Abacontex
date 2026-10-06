import { Request, Response } from 'express';
import * as ejercicioService from '../services/ejercicio.service';
import {
  actualizarResolucionDocenteSchema,
  consultarResolucionDocenteSchema,
  duplicarEjercicioSchema,
  editarEjercicioSchema,
  obtenerEjercicioPorIdSchema,
  obtenerEjerciciosQuerySchema,
} from '../validators/ejercicio.validator';

export async function digitalizarEjercicio(req: Request, res: Response) {
  const resultado = await ejercicioService.digitalizarEjercicio(req.file);

  res.status(200).json(resultado);
}

export async function generarEjercicio(req: Request, res: Response) {
  const resultado = await ejercicioService.generarEjercicio(req.body, req.user!);

  res.status(200).json(resultado);
}

export function obtenerOpcionesGeneracion(req: Request, res: Response) {
  const resultado = ejercicioService.obtenerOpcionesGeneracion();

  res.status(200).json(resultado);
}

export async function crearEjercicio(req: Request, res: Response) {
  const resultado = await ejercicioService.crearEjercicio(req.user!, req.body);

  res.status(201).json(resultado);
}

export async function obtenerEjercicios(req: Request, res: Response) {
  const { query } = obtenerEjerciciosQuerySchema.parse({
    query: req.query,
  });

  const resultado = await ejercicioService.obtenerEjercicios(req.user!, query);

  res.status(200).json(resultado);
}

export async function obtenerEjercicioPorId(req: Request, res: Response) {
  const { params } = obtenerEjercicioPorIdSchema.parse({
    params: req.params,
  });

  const resultado = await ejercicioService.obtenerEjercicioPorId(req.user!, params.id);

  res.status(200).json(resultado);
}

export async function editarEjercicio(req: Request, res: Response) {
  const { params, body } = editarEjercicioSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await ejercicioService.editarEjercicio(req.user!, params.id, body);

  res.status(200).json(resultado);
}

export async function duplicarEjercicio(req: Request, res: Response) {
  const { params } = duplicarEjercicioSchema.parse({
    params: req.params,
  });

  const resultado = await ejercicioService.duplicarEjercicio(req.user!, params.id);

  res.status(201).json(resultado);
}

export async function consultarResolucionDocente(req: Request, res: Response) {
  const { params } = consultarResolucionDocenteSchema.parse({
    params: req.params,
  });

  const resultado = await ejercicioService.consultarResolucionDocente(req.user!, params.id);

  res.status(200).json(resultado);
}

export async function guardarResolucionDocente(req: Request, res: Response) {
  const { params, body } = actualizarResolucionDocenteSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await ejercicioService.guardarResolucionDocente(req.user!, params.id, body);

  res.status(200).json(resultado);
}
