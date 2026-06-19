import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';


export const syncUser = async (
  req: Request,
  res: Response
) => {
  const usuario = await usuarioService.syncUsuario(
    req.user!
  );

  res.status(200).json(usuario);
};

export const me = async (req: Request, res: Response) => {
  const usuario = await usuarioService.getUsuarioActual(
    req.user!
  );

  if (!usuario) {
    return res.status(404).json({
      message: 'Usuario no encontrado',
    });
  }

  res.json(usuario);
};
