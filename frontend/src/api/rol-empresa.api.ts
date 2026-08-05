import api from '../services/axios';
import type { RolEmpresa } from '../types/rol-empresa.types';

export async function obtenerRolesEmpresa(): Promise<RolEmpresa[]> {
  const { data } = await api.get<RolEmpresa[]>('/roles-empresa');

  return data;
}
