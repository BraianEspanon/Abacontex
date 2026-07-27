import { Request, Response } from 'express';
import * as cursoService from '../services/curso.service';

export async function getCursos(req: Request, res: Response) {
  const cursos = await cursoService.getCursos();

  res.json(cursos);
}
