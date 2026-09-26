import { Request, Response } from 'express';
import * as ejercicioService from '../services/ejercicio.service';

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
