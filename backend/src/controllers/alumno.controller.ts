import { Request, Response } from 'express';
import * as alumnoService from '../services/alumno.service';

export async function getAlumnoActual(req: Request, res: Response) {
  const alumno = await alumnoService.getAlumnoActual(req.user!);

  res.status(200).json(alumno);
}

export async function completarRegistro(req: Request, res: Response) {
  const alumno = await alumnoService.completarRegistro(req.user!, req.body);

  res.status(200).json(alumno);
}

export async function getInvitacion(req: Request, res: Response) {
  const invitaciones = await alumnoService.getInvitacion(req.user!);

  res.status(200).json(invitaciones);
}

export async function aceptarInvitacion(req: Request, res: Response) {
  await alumnoService.aceptarInvitacion(req.user!, Number(req.params.id));

  res.sendStatus(204);
}

export async function rechazarInvitacion(req: Request, res: Response) {
  await alumnoService.rechazarInvitacion(req.user!, Number(req.params.id));

  res.sendStatus(204);
}
