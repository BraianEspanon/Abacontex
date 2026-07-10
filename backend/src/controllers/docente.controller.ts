import { Request, Response } from 'express';
import * as docenteService from '../services/docente.service';

export const crearDocente = async (req: Request, res: Response) => {
  const docente = await docenteService.crearDocente(req.body);

  res.status(201).json(docente);
};

export async function obtenerDocenteActual(req: Request, res: Response) {
  const docente = await docenteService.obtenerDocenteActual(req.user!);

  res.status(200).json(docente);
}
