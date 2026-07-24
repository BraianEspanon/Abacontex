import { Request, Response } from 'express';

import * as productoService from '../services/producto.service';

import { actualizarProductoSchema } from '../validators/producto.validator';

export async function crearProducto(req: Request, res: Response) {
  const producto = await productoService.crearProducto(req.user!, req.body);

  res.status(201).json(producto);
}

export async function actualizarProducto(req: Request, res: Response) {
  const { body, params } = actualizarProductoSchema.parse({
    body: req.body,
    params: req.params,
  });

  const producto = await productoService.actualizarProducto(req.user!, params.idProducto, body);

  res.status(200).json(producto);
}
