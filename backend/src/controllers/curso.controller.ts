import { Request, Response } from 'express';
import * as cursoService from '../services/curso.service';

export async function getCursos(req: Request, res: Response) {
  const cursos = await cursoService.getCursos();

  res.json(cursos);
}

export async function getMisCursos(req: Request, res: Response) {
  const cursos = await cursoService.getMisCursos(req.user!);

  res.status(200).json(cursos);
}
