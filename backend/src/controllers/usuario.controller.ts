import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';

export const obtenerUsuarioActual = async (req: Request, res: Response) => {
  const usuario = await usuarioService.getUsuarioActual(req.user!);

  res.json(usuario);
};

export const actualizarUsuarioActual = async (req: Request, res: Response) => {
  const usuario = await usuarioService.actualizarUsuarioActual(req.user!, req.body, req.file);

  res.json(usuario);
};

export async function actualizarPassword(req: Request, res: Response) {
  await usuarioService.actualizarPassword(req.user!, req.body);

  res.status(204).send();
}
