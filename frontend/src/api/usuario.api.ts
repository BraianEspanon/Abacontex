import clienteApi from './clienteApi';
import type { UsuarioActual } from '../types/usuario.types';

export async function sincronizarUsuarioActual(): Promise<UsuarioActual> {
  const respuesta =
    await clienteApi.post<UsuarioActual>('/auth/sync-user');

  return respuesta.data;
}

export async function obtenerUsuarioActual(): Promise<UsuarioActual> {
  const respuesta =
    await clienteApi.get<UsuarioActual>('/usuarios/me');

  return respuesta.data;
}