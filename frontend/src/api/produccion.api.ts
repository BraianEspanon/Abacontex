import clienteApi from './clienteApi';

import type {
  CrearOrdenProduccionRequest,
  DetalleOrdenProduccion,
  EstadoOrdenProduccion,
  PedidoAsociableProduccion,
  TableroProduccion,
} from '../types/produccion.types';

type EstadoOrdenProduccionApi = 'Pendientes' | 'En Producción' | 'Finalizadas';

interface HistorialOrdenProduccionApi {
  estado: EstadoOrdenProduccionApi;
  fechaInicio: string;
  fechaFin: string | null;
  duracion: number;
}

interface DetalleOrdenProduccionApi extends Omit<DetalleOrdenProduccion, 'estado' | 'historial'> {
  estado: EstadoOrdenProduccionApi;

  historial: HistorialOrdenProduccionApi[];
}

function normalizarEstadoProduccion(estado: EstadoOrdenProduccionApi): EstadoOrdenProduccion {
  switch (estado) {
    case 'Pendientes':
      return 'PENDIENTE';

    case 'En Producción':
      return 'EN_PRODUCCION';

    case 'Finalizadas':
      return 'FINALIZADA';
  }
}

/**
 * Obtiene el tablero Kanban de órdenes de producción
 * correspondiente a la empresa del alumno autenticado.
 */
export async function obtenerTableroProduccion(): Promise<TableroProduccion> {
  const { data } = await clienteApi.get<TableroProduccion>('/produccion');

  return data;
}

/**
 * Obtiene los pedidos con faltantes que todavía pueden
 * asociarse a una nueva orden de producción.
 */
export async function obtenerPedidosAsociables(): Promise<PedidoAsociableProduccion[]> {
  const { data } = await clienteApi.get<PedidoAsociableProduccion[]>(
    '/produccion/pedidos-asociables'
  );

  return data;
}

/**
 * Crea una nueva orden de producción.
 *
 * Puede tratarse de:
 * - una orden manual;
 * - una orden asociada a un faltante de pedido.
 */
export async function crearOrdenProduccion(payload: CrearOrdenProduccionRequest): Promise<unknown> {
  const { data } = await clienteApi.post('/produccion', payload);

  return data;
}

/**
 * Obtiene el detalle y seguimiento de una orden.
 */
export async function obtenerDetalleOrdenProduccion(
  idOrden: number
): Promise<DetalleOrdenProduccion> {
  const { data } = await clienteApi.get<DetalleOrdenProduccionApi>(`/produccion/${idOrden}`);

  return {
    ...data,

    estado: normalizarEstadoProduccion(data.estado),

    historial: data.historial.map((historial) => ({
      ...historial,

      estado: normalizarEstadoProduccion(historial.estado),
    })),
  };
}

/**
 * Avanza una orden:
 *
 * PENDIENTE → EN_PRODUCCION
 */
export async function iniciarOrdenProduccion(idOrden: number): Promise<unknown> {
  const { data } = await clienteApi.patch(`/produccion/${idOrden}/iniciar`);

  return data;
}

/**
 * Avanza una orden:
 *
 * EN_PRODUCCION → FINALIZADA
 *
 * Los efectos sobre stock y pedidos asociados
 * son responsabilidad del backend.
 */
export async function finalizarOrdenProduccion(idOrden: number): Promise<unknown> {
  const { data } = await clienteApi.patch(`/produccion/${idOrden}/finalizar`);

  return data;
}
