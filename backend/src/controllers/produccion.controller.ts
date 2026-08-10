import { Request, Response } from 'express';
import * as produccionService from '../services/produccion.service';
import {
  crearOrdenProduccionSchema,
  ordenProduccionIdSchema,
} from '../validators/produccion.validator';

export async function crearOrdenProduccion(req: Request, res: Response) {
  const { body } = crearOrdenProduccionSchema.parse({
    body: req.body,
  });

  const orden = await produccionService.crearOrdenProduccion(req.user!, body);

  res.status(201).json(orden);
}

export async function obtenerPedidosAsociables(req: Request, res: Response) {
  const pedidos = await produccionService.obtenerPedidosAsociables(req.user!);

  res.status(200).json(pedidos);
}

export async function obtenerTableroProduccion(req: Request, res: Response) {
  const tablero = await produccionService.obtenerTableroProduccion(req.user!);

  res.status(200).json(tablero);
}

export async function iniciarOrdenProduccion(req: Request, res: Response) {
  const { params } = ordenProduccionIdSchema.parse({
    params: req.params,
  });

  const orden = await produccionService.iniciarOrdenProduccion(req.user!, params);

  res.status(200).json(orden);
}

export async function finalizarOrdenProduccion(req: Request, res: Response) {
  const { params } = ordenProduccionIdSchema.parse({
    params: req.params,
  });

  const orden = await produccionService.finalizarOrdenProduccion(req.user!, params);

  res.status(200).json(orden);
}
