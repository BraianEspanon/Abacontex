import { Request, Response } from 'express';

import * as invitacionService from '../services/invitacion.service';

export async function crearInvitaciones(req: Request, res: Response) {
  const invitaciones = await invitacionService.crearInvitaciones(req.user!, req.body);

  res.status(201).json(invitaciones);
}

export async function getInvitacionesPendientes(req: Request, res: Response) {
  const invitaciones = await invitacionService.getInvitacionesPendientes(req.user!);

  res.status(200).json(invitaciones);
}

export async function aceptarInvitacion(req: Request, res: Response) {
  await invitacionService.aceptarInvitacion(req.user!, Number(req.params.id));

  res.sendStatus(204);
}

export async function rechazarInvitacion(req: Request, res: Response) {
  await invitacionService.rechazarInvitacion(req.user!, Number(req.params.id));

  res.sendStatus(204);
}

export async function getInvitacionesEnviadas(req: Request, res: Response) {
  const invitaciones = await invitacionService.getInvitacionesEnviadas(req.user!);

  res.json(invitaciones);
}
