import clienteApi from './clienteApi';

import type { AlumnoDisponible } from '../types/empresa.types';

import type {
  EmpresasDocenteResponse,
  EmpresaDocenteDetalle,
  ObtenerEmpresasDocenteParams,
} from '../types/empresa-docente.type';

export interface CrearEmpresaRequest {
  nombre: string;
  actividad: string;
  logo?: File | null;
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
    año: number;
  };

  cicloLectivo: {
    id: number;
    nombre: string;
  };

  integrantes: IntegranteEmpresa[];
}

export interface ActualizarEmpresaRequest {
  nombre: string;
  actividad: string;
  logo?: File | null;
  eliminarLogo?: boolean;
}

export async function obtenerCandidatosEmpresa(search?: string): Promise<AlumnoDisponible[]> {
  const termino = search?.trim();

  const respuesta = await clienteApi.get<AlumnoDisponible[]>('/empresas/candidatos', {
    params: termino ? { search: termino } : undefined,
  });

  return respuesta.data;
}

export async function crearEmpresa(datos: CrearEmpresaRequest): Promise<EmpresaCreada> {
  const formData = new FormData();

  formData.append('nombre', datos.nombre);
  formData.append('actividad', datos.actividad);

  if (datos.logo) {
    formData.append('logo', datos.logo);
  }

  const respuesta = await clienteApi.post<EmpresaCreada>('/empresas', formData);

  return respuesta.data;
}

export async function agregarParticipantesEmpresa(
  datos: AgregarParticipantesRequest
): Promise<void> {
  await clienteApi.post('/empresas/me/participantes', datos);
}

export async function obtenerEmpresaActual(): Promise<EmpresaActual | null> {
  const respuesta = await clienteApi.get<EmpresaActual | null>('/empresas/me');

  return respuesta.data;
}

export async function actualizarEmpresa(
  datos: ActualizarEmpresaRequest
): Promise<EmpresaActual | null> {
  const formData = new FormData();

  formData.append('nombre', datos.nombre);
  formData.append('actividad', datos.actividad);

  // Si se seleccionó una nueva imagen, se reemplaza el logo actual.
  if (datos.logo) {
    formData.append('logo', datos.logo);
  }

  // Si se pidió eliminar el logo, se informa al backend.
  if (datos.eliminarLogo === true) {
    formData.append('eliminarLogo', 'true');
  }

  const respuesta = await clienteApi.patch<EmpresaActual | null>('/empresas/me', formData);

  return respuesta.data;
}

/* =========================================================
   EMPRESAS DEL DOCENTE
   ========================================================= */

export async function obtenerEmpresasDocente(
  params: ObtenerEmpresasDocenteParams
): Promise<EmpresasDocenteResponse> {
  const respuesta = await clienteApi.get<EmpresasDocenteResponse>('/docentes/me/empresas', {
    params,
  });

  return respuesta.data;
}

export async function obtenerDetalleEmpresaDocente(
  empresaId: number
): Promise<EmpresaDocenteDetalle> {
  const respuesta = await clienteApi.get<EmpresaDocenteDetalle>(
    `/docentes/me/empresas/${empresaId}`
  );

  return respuesta.data;
}
