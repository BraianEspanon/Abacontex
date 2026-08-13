import { Request, Response } from 'express';

import * as ventaService from '../services/venta.service';

import { registrarVentaSchema } from '../validators/venta.validator';

export async function obtenerPedidosListos(req: Request, res: Response) {
  const resultado = await ventaService.obtenerPedidosListos(req.user!);

  res.status(200).json(resultado);
}

export async function registrarVenta(req: Request, res: Response) {
  const { body } = registrarVentaSchema.parse({
    body: req.body,
  });

  const resultado = await ventaService.registrarVenta(req.user!, body);

  res.status(201).json(resultado);
}
