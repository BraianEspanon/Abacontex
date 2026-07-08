import { Request, Response } from 'express';

import * as empresaService from '../services/empresa.service';

type cambiarRolParticipanteParams = {
  idAlumno: string;
};

type modificarRolesEmpresaParams = {
  idEmpresa: string;
};

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

export async function cambiarRolParticipante(
  req: Request<cambiarRolParticipanteParams>,
  res: Response
) {
  await empresaService.cambiarRolParticipante(
    req.user!,
    req.params.idAlumno,
    req.body.idRolEmpresa
  );

  res.sendStatus(204);
}

export async function modificarRolesEmpresa(
  req: Request<modificarRolesEmpresaParams>,
  res: Response
) {
  await empresaService.modificarRolesEmpresa(
    req.user!,
    Number(req.params.idEmpresa),
    req.body.roles
  );

  res.sendStatus(204);
}
