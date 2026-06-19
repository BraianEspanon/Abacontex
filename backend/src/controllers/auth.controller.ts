import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';

export const me = (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
};

export const syncUser = async (
  req: Request,
  res: Response
) => {
  const usuario = await usuarioService.syncUsuario(
    req.user!
  );

  res.status(200).json(usuario);
};