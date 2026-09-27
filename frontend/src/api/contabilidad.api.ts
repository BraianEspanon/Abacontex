import clienteApi from './clienteApi';

import type {
  AsientoDetalleEdicion,
  AsientoResumen,
  CuentasConFolioResponse,
  DetalleOperacionPendiente,
  EditarAsientoRequest,
  LibroDiarioResponse,
  OperacionesPendientesParams,
  OperacionesPendientesResponse,
  RegistrarAsientoRequest,
  ResumenContabilidad,
  TipoMovimientoAsiento,
  TipoOperacionPendiente,
} from '../types/contabilidad.types';

/* =========================================================
   DASHBOARD
   ========================================================= */

export async function obtenerResumenContabilidad() {
  const { data } = await clienteApi.get<ResumenContabilidad>('/contabilidad/asientos/resumen');

  return data;
}

export async function obtenerOperacionesPendientes(params: OperacionesPendientesParams = {}) {
  const { data } = await clienteApi.get<OperacionesPendientesResponse>(
    '/contabilidad/asientos/pendientes',
    {
      params,
    }
  );

  return data;
}

export async function obtenerUltimosAsientos(limit = 5) {
  const { data } = await clienteApi.get<AsientoResumen[]>('/contabilidad/asientos/ultimos', {
    params: {
      limit,
    },
  });

  return data;
}

/* =========================================================
   OPERACIÓN PENDIENTE
   ========================================================= */

export async function obtenerDetalleOperacionPendiente(tipo: TipoOperacionPendiente, id: number) {
  const { data } = await clienteApi.get<DetalleOperacionPendiente>(
    `/contabilidad/asientos/pendientes/${tipo}/${id}`
  );

  return data;
}

/* =========================================================
   DATOS PARA ASIENTOS
   ========================================================= */

export async function obtenerCuentasContablesConFolio() {
  const { data } = await clienteApi.get<CuentasConFolioResponse>('/contabilidad/asientos/cuentas');

  return data;
}

export async function obtenerTiposMovimientoAsiento() {
  const { data } = await clienteApi.get<TipoMovimientoAsiento[]>(
    '/contabilidad/asientos/tipos-movimiento'
  );

  return data;
}

/* =========================================================
   REGISTRAR ASIENTO
   ========================================================= */

export async function registrarAsiento(payload: RegistrarAsientoRequest) {
  const { data } = await clienteApi.post('/contabilidad/asientos', payload);

  return data;
}

/* =========================================================
   LIBRO DIARIO
   ========================================================= */

export async function obtenerLibroDiario() {
  const { data } = await clienteApi.get<LibroDiarioResponse>('/contabilidad/asientos/libro-diario');

  return data;
}

/* =========================================================
   EDITAR ASIENTO
   ========================================================= */

export async function obtenerAsientoPorId(idAsiento: number) {
  const { data } = await clienteApi.get<AsientoDetalleEdicion>(
    `/contabilidad/asientos/${idAsiento}`
  );

  return data;
}

export async function editarAsiento(idAsiento: number, payload: EditarAsientoRequest) {
  const { data } = await clienteApi.patch<AsientoDetalleEdicion>(
    `/contabilidad/asientos/${idAsiento}`,
    payload
  );

  return data;
}
