import { Request, Response } from 'express';

import * as simulacionService from '../services/simulacion.service';

import {
  crearSimulacionSchema,
  editarTituloSimulacionSchema,
  obtenerConversacionSimulacionSchema,
  obtenerEntregasSimulacionSchema,
  obtenerResumenSimulacionSchema,
  obtenerSimulacionesAlumnoQuerySchema,
  obtenerSimulacionesDocenteQuerySchema,
  responderDecisionSimulacionSchema,
} from '../validators/simulacion.validator';

export async function crearSimulacion(req: Request, res: Response) {
  const { body } = crearSimulacionSchema.parse({
    body: req.body,
  });

  const resultado = await simulacionService.crearSimulacion(req.user!, body);

  res.status(201).json(resultado);
}

export function obtenerOpcionesCrearSimulacion(_req: Request, res: Response) {
  const resultado = simulacionService.obtenerOpcionesCrearSimulacion();
  res.json(resultado);
}

export function obtenerFiltrosDashboardAlumno(_req: Request, res: Response) {
  const resultado = simulacionService.obtenerFiltrosDashboardAlumno();
  res.json(resultado);
}

export async function listarSimulacionesDocente(req: Request, res: Response) {
  const { query } = obtenerSimulacionesDocenteQuerySchema.parse({
    query: req.query,
  });

  const resultado = await simulacionService.listarSimulacionesDocente(req.user!, query);

  res.json(resultado);
}

export async function editarTituloSimulacion(req: Request, res: Response) {
  const { params, body } = editarTituloSimulacionSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await simulacionService.editarTituloSimulacion(req.user!, params.id, body);

  res.json(resultado);
}

export async function obtenerEntregasSimulacion(req: Request, res: Response) {
  const { params, query } = obtenerEntregasSimulacionSchema.parse({
    params: req.params,
    query: req.query,
  });

  const resultado = await simulacionService.obtenerEntregasSimulacion(req.user!, params.id, query);

  res.json(resultado);
}

export async function listarSimulacionesAlumno(req: Request, res: Response) {
  const { query } = obtenerSimulacionesAlumnoQuerySchema.parse({
    query: req.query,
  });

  const resultado = await simulacionService.listarSimulacionesAlumno(req.user!, query);

  res.json(resultado);
}

export async function obtenerConversacionSimulacion(req: Request, res: Response) {
  const { params } = obtenerConversacionSimulacionSchema.parse({
    params: req.params,
  });

  const resultado = await simulacionService.obtenerConversacionSimulacion(req.user!, params.id);

  res.json(resultado);
}

export async function responderDecisionSimulacion(req: Request, res: Response) {
  const { params, body } = responderDecisionSimulacionSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await simulacionService.responderDecisionSimulacion(req.user!, params.id, body);

  res.json(resultado);
}

export async function obtenerResumenSimulacion(req: Request, res: Response) {
  const { params } = obtenerResumenSimulacionSchema.parse({
    params: req.params,
  });

  const resumen = await simulacionService.obtenerResumenSimulacion(req.user!, params.id);

  res.json(resumen);
}
