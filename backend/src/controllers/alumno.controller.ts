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
