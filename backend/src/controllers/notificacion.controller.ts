import { Request, Response } from 'express';
import * as notificacionService from '../services/notificacion.service';
import {
  obtenerNotificacionesQuerySchema,
  marcarNotificacionLeidaSchema,
} from '../validators/notificacion.validator';

export async function obtenerNotificaciones(req: Request, res: Response) {
  const { query } = obtenerNotificacionesQuerySchema.parse({
    query: req.query,
  });

  const resultado = await notificacionService.obtenerNotificaciones(req.user!, query);

  res.status(200).json(resultado);
}

export async function obtenerContadorNoLeidas(req: Request, res: Response) {
  const resultado = await notificacionService.obtenerContadorNoLeidas(req.user!);

  res.status(200).json(resultado);
}

export async function marcarNotificacionComoLeida(req: Request, res: Response) {
  const { params } = marcarNotificacionLeidaSchema.parse({
    params: req.params,
  });

  const resultado = await notificacionService.marcarNotificacionComoLeida(req.user!, params.id);

  res.status(200).json(resultado);
}

export async function marcarTodasComoLeidas(req: Request, res: Response) {
  const resultado = await notificacionService.marcarTodasComoLeidas(req.user!);

  res.status(200).json(resultado);
}
