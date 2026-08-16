import { Request, Response } from 'express';

import { obtenerVentasPendientesSchema } from '../validators/factura.validator';

import * as facturaService from '../services/factura.service';

export async function obtenerVentasPendientesFacturacion(req: Request, res: Response) {
  const { query } = obtenerVentasPendientesSchema.parse({
    query: req.query,
  });

  const response = await facturaService.obtenerVentasPendientesFacturacion(req.user!, query);

  res.status(200).json(response);
}
