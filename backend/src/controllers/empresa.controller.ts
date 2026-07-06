import { Request, Response } from 'express';

import * as empresaService from '../services/empresa.service';

export async function crearEmpresa(req: Request, res: Response) {
  const empresa = await empresaService.crearEmpresa(req.user!, req.body);

  res.status(201).json(empresa);
}

export async function getEmpresaActual(req: Request, res: Response) {
  const empresa = await empresaService.getEmpresaActual(req.user!);

  res.status(200).json(empresa);
}

export async function actualizarEmpresa(req: Request, res: Response) {
  const empresa = await empresaService.actualizarEmpresa(req.user!, req.body);

  res.status(200).json(empresa);
}

export async function getCandidatos(req: Request, res: Response) {
  const candidatos = await empresaService.getCandidatos(
    req.user!,
    req.query.search as string | undefined
  );

  res.status(200).json(candidatos);
}

export async function agregarParticipantes(req: Request, res: Response) {
  await empresaService.agregarParticipantes(req.user!, req.body.participantes);

  res.sendStatus(204);
}
