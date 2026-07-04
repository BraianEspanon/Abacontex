import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';

export const crearUsuario = async (req: Request, res: Response) => {
  const usuario = await usuarioService.crearUsuario(req.body);

  res.status(201).json(usuario);
};

export const obtenerUsuarioActual = async (req: Request, res: Response) => {
  const usuario = await usuarioService.getUsuarioActual(req.user!);

  if (!usuario) {
    return res.status(404).json({
      message: 'Usuario no encontrado',
    });
  }

  res.json(usuario);
};

export const actualizarUsuarioActual = async (req: Request, res: Response) => {
  const usuario = await usuarioService.actualizarUsuarioActual(req.user!, req.body);

  res.json(usuario);
};

export async function actualizarPassword(req: Request, res: Response) {
  await usuarioService.actualizarPassword(req.user!, req.body);

  res.status(204).send();
}
