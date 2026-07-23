import { Request, Response } from 'express';

import * as productoService from '../services/producto.service';

export async function crearProducto(req: Request, res: Response) {
  const producto = await productoService.crearProducto(req.user!, req.body);

  res.status(201).json(producto);
}
