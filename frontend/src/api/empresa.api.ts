import clienteApi from './clienteApi';
import type { AlumnoDisponible } from '../types/empresa.types';

export interface CrearEmpresaRequest {
  nombre: string;
  actividad: string;
  logoUrl: string | null;
}

export interface EmpresaCreada {
  id: number;
  nombre: string;
  actividad: string;
  logoUrl: string | null;
  puntos: number;
  idCurso: number;
  idCicloLectivo: number;
}

export interface AgregarParticipantesRequest {
  participantes: string[];
}

export interface RolEmpresaActual {
  id: number;
  nombre: string;
}

export interface IntegranteEmpresa {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rolEmpresa: RolEmpresaActual | null;
}

export interface EmpresaActual {
  id: number;
  nombre: string;
  actividad: string;
  logoUrl: string | null;
  puntos: number;
  curso: {
    id: number;
    nombre: string;
  };
  cicloLectivo: {
    id: number;
    nombre: number;
  };
  integrantes: IntegranteEmpresa[];
}

export interface ActualizarEmpresaRequest {
  nombre: string;
  actividad: string;
  logoUrl: string | null;
}

export async function obtenerCandidatosEmpresa(
  search?: string,
): Promise<AlumnoDisponible[]> {
  const termino = search?.trim();

  const respuesta = await clienteApi.get<AlumnoDisponible[]>(
    '/empresas/candidatos',
    {
      params: termino ? { search: termino } : undefined,
    },
  );

  return respuesta.data;
}

export async function crearEmpresa(
  datos: CrearEmpresaRequest,
): Promise<EmpresaCreada> {
  const respuesta = await clienteApi.post<EmpresaCreada>(
    '/empresas',
    datos,
  );

  return respuesta.data;
}

export async function agregarParticipantesEmpresa(
  datos: AgregarParticipantesRequest,
): Promise<void> {
  await clienteApi.post(
    '/empresas/me/participantes',
    datos,
  );
}

export async function obtenerEmpresaActual(): Promise<EmpresaActual> {
  const respuesta =
    await clienteApi.get<EmpresaActual>('/empresas/me');

  return respuesta.data;
}

export async function actualizarEmpresa(
  datos: ActualizarEmpresaRequest,
): Promise<EmpresaActual> {
  const respuesta = await clienteApi.patch<EmpresaActual>(
    '/empresas/me',
    datos,
  );

  return respuesta.data;
}