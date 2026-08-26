import axios from 'axios';

import api from '../services/axios';

import type { Invitacion } from '../types/invitacion.types';

export interface CrearInvitacionesRequest {
  emails: string[];
}

export async function obtenerInvitacion(): Promise<Invitacion | null> {
  try {
    const response = await api.get<Invitacion>('/alumnos/me/invitacion');

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function aceptarInvitacion(idInvitacion: number): Promise<void> {
  await api.post(`/alumnos/me/invitacion/${idInvitacion}/aceptar`);
}

export async function rechazarInvitacion(idInvitacion: number): Promise<void> {
  await api.post(`/alumnos/me/invitacion/${idInvitacion}/rechazar`);
}

export async function crearInvitacionesEmpresa(datos: CrearInvitacionesRequest): Promise<void> {
  await api.post('/empresas/me/invitaciones', datos);
}
