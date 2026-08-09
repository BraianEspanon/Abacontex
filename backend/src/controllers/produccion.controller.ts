import { Request, Response } from 'express';
import * as produccionService from '../services/produccion.service';
import { crearOrdenProduccionSchema } from '../validators/produccion.validator';

export async function crearOrdenProduccion(req: Request, res: Response) {
  const { body } = crearOrdenProduccionSchema.parse({
    body: req.body,
  });

  const orden = await produccionService.crearOrdenProduccion(req.user!, body);

  res.status(201).json(orden);
}
