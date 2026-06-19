import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';
import * as keycloakAdminService from '../services/keycloak-admin.service';

export const syncUser = async (req: Request, res: Response) => {
  const usuario = await usuarioService.syncUsuario(req.user!);

  res.status(200).json(usuario);
};

export const me = async (req: Request, res: Response) => {
  const usuario = await usuarioService.getUsuarioActual(req.user!);

  if (!usuario) {
    return res.status(404).json({
      message: 'Usuario no encontrado',
    });
  }

  res.json(usuario);
};

export const adminTest = async (_req: Request, res: Response) => {
  const token = await keycloakAdminService.getAdminToken();

  res.json({
    ok: true,
    tokenPreview: token.substring(0, 30),
  });
};
