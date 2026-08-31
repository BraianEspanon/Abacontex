import api from '../services/axios';

import type {
  CuentaContable,
  CuentasQueryParams,
  CuentasResponse,
  EditarCuentaRequest,
  RegistrarCuentaRequest,
  TipoCuentaConRubros,
} from '../types/cuenta.types';

export async function obtenerCuentas(params: CuentasQueryParams = {}): Promise<CuentasResponse> {
  const { data } = await api.get<CuentasResponse>('/contabilidad/cuentas', {
    params,
  });

  return data;
}

export async function obtenerTiposCuenta(): Promise<TipoCuentaConRubros[]> {
  const { data } = await api.get<TipoCuentaConRubros[]>('/contabilidad/cuentas/tipos');

  return data;
}

export async function registrarCuenta(datos: RegistrarCuentaRequest): Promise<CuentaContable> {
  const { data } = await api.post<CuentaContable>('/contabilidad/cuentas', datos);

  return data;
}

export async function editarCuenta(
  idCuenta: number,
  datos: EditarCuentaRequest
): Promise<CuentaContable> {
  const { data } = await api.patch<CuentaContable>(`/contabilidad/cuentas/${idCuenta}`, datos);

  return data;
}
