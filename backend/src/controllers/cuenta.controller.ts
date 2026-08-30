import { Request, Response } from 'express';

import * as cuentaService from '../services/cuenta.service';

import { registrarCuentaSchema } from '../validators/cuenta.validator';

export async function registrarCuenta(req: Request, res: Response) {
  const { body } = registrarCuentaSchema.parse({
    body: req.body,
  });

  const resultado = await cuentaService.registrarCuenta(req.user!, body);

  res.status(201).json(resultado);
}
