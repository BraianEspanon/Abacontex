import clienteApi from './clienteApi';

import type {
  ActualizarResolucionDocenteRequest,
  CrearEjercicioRequest,
  CuentasContablesResponse,
  DetalleEjercicio,
  DigitalizarEjercicioResponse,
  EditarEjercicioRequest,
  EjercicioCreadoResponse,
  FiltrosEjercicios,
  GenerarEjercicioIARequest,
  GenerarEjercicioIAResponse,
  ListadoEjerciciosResponse,
  ResolucionDocenteResponse,
} from '../types/ejercicio.types';

export async function obtenerEjercicios(filtros: FiltrosEjercicios = {}) {
  const { data } = await clienteApi.get<ListadoEjerciciosResponse>('/ejercicios', {
    params: filtros,
  });

  return data;
}

export async function digitalizarEjercicio(archivo: File) {
  const formData = new FormData();

  formData.append('archivo', archivo);

  const { data } = await clienteApi.post<DigitalizarEjercicioResponse>(
    '/ejercicios/digitalizar',
    formData
  );

  return data;
}

export async function crearEjercicio(ejercicio: CrearEjercicioRequest) {
  const { data } = await clienteApi.post<EjercicioCreadoResponse>('/ejercicios', ejercicio);

  return data;
}

export async function generarEjercicioIA(parametros: GenerarEjercicioIARequest) {
  const { data } = await clienteApi.post<GenerarEjercicioIAResponse>(
    '/ejercicios/generar',
    parametros
  );

  return data;
}

export async function obtenerEjercicioPorId(idEjercicio: number) {
  const { data } = await clienteApi.get<DetalleEjercicio>(`/ejercicios/${idEjercicio}`);

  return data;
}

export async function editarEjercicio(idEjercicio: number, datos: EditarEjercicioRequest) {
  const { data } = await clienteApi.patch<DetalleEjercicio>(`/ejercicios/${idEjercicio}`, datos);

  return data;
}

export async function obtenerResolucionDocente(idEjercicio: number) {
  const { data } = await clienteApi.get<ResolucionDocenteResponse>(
    `/ejercicios/${idEjercicio}/resolucion`
  );

  return data;
}

export async function actualizarResolucionDocente(
  idEjercicio: number,
  datos: ActualizarResolucionDocenteRequest
) {
  const { data } = await clienteApi.patch<ResolucionDocenteResponse>(
    `/ejercicios/${idEjercicio}/resolucion`,
    datos
  );

  return data;
}

export async function obtenerCuentasContables() {
  const { data } = await clienteApi.get<CuentasContablesResponse>('/contabilidad/cuentas', {
    params: {
      page: 1,
      pageSize: 100,
    },
  });

  return data;
}
