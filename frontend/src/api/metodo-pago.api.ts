import clienteApi from './clienteApi';

import type { MetodoPago } from '../types/venta.types';

interface MetodoPagoBackend {
  metodoPago: {
    idMetodoPago: number;
    nombre: string;
  };
}

export async function obtenerMetodosPago(): Promise<MetodoPago[]> {
  const { data } = await clienteApi.get<MetodoPagoBackend[]>('/metodos-pago/me');

  return data.map((item) => ({
    idMetodoPago: item.metodoPago.idMetodoPago,
    nombre: item.metodoPago.nombre,
  }));
}
