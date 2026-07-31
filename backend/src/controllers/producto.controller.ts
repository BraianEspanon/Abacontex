import { Request, Response } from 'express';

import * as productoService from '../services/producto.service';

import {
  actualizarProductoSchema,
  eliminarProductoSchema,
  getProductoSchema,
  obtenerProductosSchema,
} from '../validators/producto.validator';

export async function crearProducto(req: Request, res: Response) {
  const producto = await productoService.crearProducto(req.user!, req.body, req.file);

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

export async function getProducto(req: Request, res: Response) {
  const { params } = getProductoSchema.parse({
    params: req.params,
  });

  const producto = await productoService.getProducto(req.user!, params.idProducto);

  res.status(200).json(producto);
}

export async function obtenerProductos(req: Request, res: Response) {
  const { query } = obtenerProductosSchema.parse({
    query: req.query,
  });

  const productos = await productoService.obtenerProductos(req.user!, query);

  res.status(200).json(productos);
}

export async function eliminarProducto(req: Request, res: Response) {
  const { params } = eliminarProductoSchema.parse({
    params: req.params,
  });

  await productoService.eliminarProducto(req.user!, params.idProducto);

  res.sendStatus(204);
}
