import { Request, Response } from 'express';

import * as cuentaService from '../services/cuenta.service';

import { registrarCuentaSchema, editarCuentaSchema } from '../validators/cuenta.validator';

export async function registrarCuenta(req: Request, res: Response) {
  const { body } = registrarCuentaSchema.parse({
    body: req.body,
  });

  const resultado = await cuentaService.registrarCuenta(req.user!, body);

  res.status(201).json(resultado);
}

export async function obtenerTiposCuenta(req: Request, res: Response) {
  const resultado = await cuentaService.obtenerTiposCuenta(req.user!);

  res.status(200).json(resultado);
}

export async function editarCuenta(req: Request, res: Response) {
  const { params, body } = editarCuentaSchema.parse({
    params: req.params,
    body: req.body,
  });

  const resultado = await cuentaService.editarCuenta(req.user!, params.idCuenta, body);

  res.status(200).json(resultado);
}
