import clienteApi from './clienteApi';

import type {
  ActualizarPasswordRequest,
  ActualizarUsuarioActualRequest,
  UsuarioActual,
} from '../types/usuario.types';

export async function sincronizarUsuarioActual(): Promise<UsuarioActual> {
  const respuesta = await clienteApi.post<UsuarioActual>('/auth/sync-user');

  return respuesta.data;
}

export async function obtenerUsuarioActual(): Promise<UsuarioActual> {
  const respuesta = await clienteApi.get<UsuarioActual>('/usuarios/me');

  return respuesta.data;
}

export async function actualizarUsuarioActual(
  datos: ActualizarUsuarioActualRequest
): Promise<UsuarioActual> {
  const respuesta = await clienteApi.patch<UsuarioActual>('/usuarios/me', datos);

  return respuesta.data;
}

export async function actualizarPassword(datos: ActualizarPasswordRequest): Promise<void> {
  await clienteApi.patch('/usuarios/me/password', datos);
}
