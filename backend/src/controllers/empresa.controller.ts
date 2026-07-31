import { Request, Response } from 'express';

import * as empresaService from '../services/empresa.service';
import {
  cambiarRolParticipanteSchema,
  modificarRolesEmpresaSchema,
} from '../validators/empresa.validator';

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
  await empresaService.agregarParticipantes(req.user!, req.body);

  res.sendStatus(204);
}

export async function cambiarRolParticipante(req: Request, res: Response) {
  const { body, params } = cambiarRolParticipanteSchema.parse({
    body: req.body,
    params: req.params,
  });

  await empresaService.cambiarRolParticipante(req.user!, params.idAlumno, body.idRolEmpresa);

  res.sendStatus(204);
}

export async function modificarRolesEmpresa(req: Request, res: Response) {
  const { body, params } = modificarRolesEmpresaSchema.parse({
    body: req.body,
    params: req.params,
  });

  await empresaService.modificarRolesEmpresa(req.user!, params.idEmpresa, body.roles);

  res.sendStatus(204);
}

export async function crearInvitaciones(req: Request, res: Response) {
  const invitaciones = await empresaService.crearInvitaciones(req.user!, req.body);

  res.status(201).json(invitaciones);
}

export async function getInvitacionesEnviadas(req: Request, res: Response) {
  const invitaciones = await empresaService.getInvitacionesEnviadas(req.user!);

  res.json(invitaciones);
}
