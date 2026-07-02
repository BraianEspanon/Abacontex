import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';

export const crearUsuario = async (req: Request, res: Response) => {
  const usuario = await usuarioService.crearUsuario(req.body);

  res.status(201).json(usuario);
};

export async function actualizarPassword(req: Request, res: Response) {
  await usuarioService.actualizarPassword(req.user!, req.body);

  res.status(204).send();
}
