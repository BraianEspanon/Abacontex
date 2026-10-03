import clienteApi from './clienteApi';

import type { EmpresaDashboardResponse } from '../types/empresa-dashboard.types';

export async function obtenerEmpresaDashboard(): Promise<EmpresaDashboardResponse> {
  const { data } = await clienteApi.get<EmpresaDashboardResponse>('/empresas/me/dashboard');

  return data;
}
