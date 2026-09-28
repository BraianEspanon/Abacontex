import { Request, Response } from 'express';
import * as ejercicioService from '../services/ejercicio.service';
import {
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
