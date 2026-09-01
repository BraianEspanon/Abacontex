import { Request, Response } from 'express';

import * as asientoService from '../services/asiento.service';

import {
  obtenerPendientesSchema,
  obtenerDetallePendienteSchema,
  crearAsientoSchema,
  obtenerUltimosAsientosSchema,
} from '../validators/asiento.validator';

export async function obtenerTiposMovimiento(req: Request, res: Response) {
  const resultado = await asientoService.obtenerTiposMovimiento(req.user!);

  res.status(200).json(resultado);
}

export async function obtenerPendientes(req: Request, res: Response) {
  const { query } = obtenerPendientesSchema.parse({
    query: req.query,
  });

  const resultado = await asientoService.obtenerPendientes(req.user!, query);

  res.status(200).json(resultado);
}

export async function obtenerDetallePendiente(req: Request, res: Response) {
  const { params } = obtenerDetallePendienteSchema.parse({
    params: req.params,
  });

  const resultado = await asientoService.obtenerDetallePendiente(req.user!, params);

  res.status(200).json(resultado);
}

export async function crearAsientoContable(req: Request, res: Response) {
  const { body } = crearAsientoSchema.parse({
    body: req.body,
  });

  const resultado = await asientoService.crearAsientoContable(req.user!, body);

  res.status(201).json(resultado);
}

export async function obtenerCuentasConFolios(req: Request, res: Response) {
  const resultado = await asientoService.obtenerCuentasConFolios(req.user!);

  res.status(200).json(resultado);
}

export async function obtenerUltimosAsientos(req: Request, res: Response) {
  const { query } = obtenerUltimosAsientosSchema.parse({
    query: req.query,
  });

  const resultado = await asientoService.obtenerUltimosAsientos(req.user!, query);

  res.status(200).json(resultado);
}

export async function obtenerResumenMetricas(req: Request, res: Response) {
  const resultado = await asientoService.obtenerResumenMetricas(req.user!);

  res.status(200).json(resultado);
}
