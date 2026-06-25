import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';

export const crearUsuario = async (
  req: Request,
  res: Response
) => {
  const usuario =
    await usuarioService.crearUsuario(
      req.body
    );

  res.status(201).json(usuario);
};