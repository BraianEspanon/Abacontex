import { Request, Response } from 'express';
import * as docenteService from '../services/docente.service';
import {
  EmpresaDocenteFiltrosDTO,
  obtenerEmpresaSchema,
  obtenerEmpresasSchema,
} from '../validators/docente.validator';

export const crearDocente = async (req: Request, res: Response) => {
  const docente = await docenteService.crearDocente(req.body);

  res.status(201).json(docente);
};

export async function obtenerDocenteActual(req: Request, res: Response) {
  const docente = await docenteService.obtenerDocenteActual(req.user!);

  res.status(200).json(docente);
}

export async function obtenerDashboardDocente(req: Request, res: Response) {
  const dashboard = await docenteService.obtenerDashboard(req.user!, req.query);

  res.json(dashboard);
}

export async function obtenerCursosDocente(req: Request, res: Response) {
  const cursos = await docenteService.obtenerCursos(req.user!);

  res.json(cursos);
}

export async function obtenerEmpresasDocente(req: Request, res: Response) {
  const { query: filtros } = obtenerEmpresasSchema.parse({
    query: req.query,
  });

  const empresas = await docenteService.obtenerEmpresas(req.user!, filtros);

  res.json(empresas);
}

export async function obtenerDetalleEmpresaDocente(req: Request, res: Response) {
  const { params } = obtenerEmpresaSchema.parse({
    params: req.params,
  });

  const empresa = await docenteService.obtenerDetalleEmpresaDocente(req.user!, params.empresaId);

  res.json(empresa);
}
