import { Request, Response } from 'express';
import * as contabilidadService from '../services/contabilidad.service';

export async function obtenerLibroMayor(req: Request, res: Response) {
  const resultado = await contabilidadService.obtenerLibroMayor(req.user!);

  res.status(200).json(resultado);
}

export async function obtenerEstadoResultados(req: Request, res: Response) {
  const resultado = await contabilidadService.obtenerEstadoResultados(req.user!);

  res.status(200).json(resultado);
}

export async function obtenerBalanceGeneral(req: Request, res: Response) {
  const resultado = await contabilidadService.obtenerBalanceGeneral(req.user!);

  res.status(200).json(resultado);
}
