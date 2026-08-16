import { Request, Response } from 'express';
import {
  obtenerVentasPendientesSchema,
  generarFacturaSchema,
  obtenerDetalleFacturaSchema,
} from '../validators/factura.validator';
import * as facturaService from '../services/factura.service';

export async function obtenerVentasPendientesFacturacion(req: Request, res: Response) {
  const { query } = obtenerVentasPendientesSchema.parse({
    query: req.query,
  });

  const response = await facturaService.obtenerVentasPendientesFacturacion(req.user!, query);

  res.status(200).json(response);
}

export async function generarFactura(req: Request, res: Response) {
  const { body } = generarFacturaSchema.parse({
    body: req.body,
  });

  const nuevaFactura = await facturaService.generarFactura(req.user!, body);

  res.status(201).json(nuevaFactura);
}

export async function obtenerDetalleFactura(req: Request, res: Response) {
  const { params } = obtenerDetalleFacturaSchema.parse({
    params: req.params,
  });

  const detalle = await facturaService.obtenerDetalleFactura(req.user!, params.idFactura);

  res.status(200).json(detalle);
}
