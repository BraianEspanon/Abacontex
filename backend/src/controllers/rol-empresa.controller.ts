import { Request, Response } from 'express';
import * as rolEmpresaService from '../services/rol-empresa.service';

export async function getRolesEmpresa(req: Request, res: Response) {
  const roles = await rolEmpresaService.getRolesEmpresa();

  res.json(roles);
}
