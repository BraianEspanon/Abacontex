import { CalendarDays, Check, CheckCircle2, CirclePlay, Clock3, Package, X } from 'lucide-react';

import type {
  DetalleOrdenProduccion,
  EstadoOrdenProduccion,
  PrioridadOrdenProduccion,
} from '../../types/produccion.types';

interface DetalleOrdenProduccionModalProps {
  abierto: boolean;
  orden: DetalleOrdenProduccion | undefined;
  cargando: boolean;
  error: boolean;
  onCerrar: () => void;
  onIniciar: (idOrden: number) => void;
  onFinalizar: (idOrden: number) => void;
  actualizando?: boolean;
}

const nombresEstado: Record<EstadoOrdenProduccion, string> = {
  PENDIENTE: 'Pendiente',
  EN_PRODUCCION: 'En proceso',
  FINALIZADA: 'Finalizada',
};

const nombresPrioridad: Record<PrioridadOrdenProduccion, string> = {
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
};

const clasesPrioridad: Record<PrioridadOrdenProduccion, string> = {
  ALTA: 'bg-red-100 text-red-700',
  MEDIA: 'bg-orange-100 text-orange-700',
  BAJA: 'bg-green-100 text-green-700',
};

const clasesEstado: Record<EstadoOrdenProduccion, string> = {
  PENDIENTE: 'bg-orange-50 text-orange-700',
  EN_PRODUCCION: 'bg-green-50 text-green-700',
  FINALIZADA: 'bg-gray-100 text-gray-700',
};

const formatearFecha = (fecha: string) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha));
};

const formatearDuracion = (milisegundos: number) => {
  const totalMinutos = Math.floor(milisegundos / 60000);

  const dias = Math.floor(totalMinutos / 1440);
  const horas = Math.floor((totalMinutos % 1440) / 60);
  const minutos = totalMinutos % 60;

  const partes: string[] = [];

  if (dias > 0) {
    partes.push(`${dias} ${dias === 1 ? 'día' : 'días'}`);
  }

  if (horas > 0) {
    partes.push(`${horas} h`);
  }

  if (dias === 0 && horas === 0) {
    partes.push(`${minutos} min`);
  }

  return partes.join(' ');
};

export default function DetalleOrdenProduccionModal({
  abierto,
  orden,
  cargando,
  error,
  onCerrar,
  onIniciar,
  onFinalizar,
  actualizando = false,
}: DetalleOrdenProduccionModalProps) {
  if (!abierto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onMouseDown={onCerrar}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">Detalle de orden de producción</h2>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cargando && (
          <div className="flex min-h-64 items-center justify-center p-6">
            <p className="text-sm text-gray-500">Cargando detalle de la orden...</p>
          </div>
        )}

        {error && !cargando && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-800">No fue posible cargar la orden.</p>

              <p className="mt-1 text-sm text-red-700">Cerrá el detalle e intentá nuevamente.</p>
            </div>
          </div>
        )}

        {orden && !cargando && !error && (
          <div className="space-y-5 p-6">
            {/* Resumen principal */}
            <section className="rounded-2xl border border-gray-200 p-4">
              <div className="grid gap-4 sm:grid-cols-5">
                <div>
                  <p className="text-xs text-gray-500">Orden</p>

                  <p className="mt-1 font-semibold text-[#496647]">
                    ORD-{orden.idOrden.toString().padStart(4, '0')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Producto</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">{orden.producto.nombre}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Estado actual</p>

                  <span
                    className={[
                      'mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                      clasesEstado[orden.estado],
                    ].join(' ')}
                  >
                    {nombresEstado[orden.estado]}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Prioridad</p>

                  <span
                    className={[
                      'mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                      clasesPrioridad[orden.prioridad],
                    ].join(' ')}
                  >
                    {nombresPrioridad[orden.prioridad]}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Cantidad</p>

                  <p className="mt-1 text-sm font-medium text-gray-800">{orden.cantidad} u.</p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500">Pedido asociado</p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {orden.pedido
                    ? `PED-${orden.pedido.idPedido.toString().padStart(5, '0')}`
                    : 'Sin pedido asociado'}
                </p>
              </div>
            </section>

            {/* Tiempos */}
            <section className="grid gap-3 sm:grid-cols-2">
              <DatoTiempo
                icono={<CalendarDays className="h-4 w-4" />}
                etiqueta="Fecha de creación"
                valor={formatearFecha(orden.fechaCreacion)}
              />

              <DatoTiempo
                icono={<Clock3 className="h-4 w-4" />}
                etiqueta="Tiempo en proceso"
                valor={formatearDuracion(orden.tiempos.enProduccion)}
              />

              <DatoTiempo
                icono={<Clock3 className="h-4 w-4" />}
                etiqueta="Tiempo en pendiente"
                valor={formatearDuracion(orden.tiempos.pendiente)}
              />

              <DatoTiempo
                icono={<Clock3 className="h-4 w-4" />}
                etiqueta="Tiempo total transcurrido"
                valor={formatearDuracion(orden.tiempos.total)}
              />
            </section>

            {/* Progreso */}
            <section className="rounded-2xl border border-gray-200 px-6 py-5">
              <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start">
                <PasoProgreso
                  nombre="Pendiente"
                  estadoActual={orden.estado}
                  estadoPaso="PENDIENTE"
                />

                <LineaProgreso activa={orden.estado !== 'PENDIENTE'} />

                <PasoProgreso
                  nombre="En proceso"
                  estadoActual={orden.estado}
                  estadoPaso="EN_PRODUCCION"
                />

                <LineaProgreso activa={orden.estado === 'FINALIZADA'} />

                <PasoProgreso
                  nombre="Finalizada"
                  estadoActual={orden.estado}
                  estadoPaso="FINALIZADA"
                />
              </div>
            </section>

            {/* Acción */}
            {orden.estado !== 'FINALIZADA' && (
              <div className="flex justify-end">
                {orden.estado === 'PENDIENTE' && (
                  <button
                    type="button"
                    disabled={actualizando}
                    onClick={() => onIniciar(orden.idOrden)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#6f9468] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f8059] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CirclePlay className="h-4 w-4" />
                    Iniciar producción
                  </button>
                )}

                {orden.estado === 'EN_PRODUCCION' && (
                  <button
                    type="button"
                    disabled={actualizando}
                    onClick={() => onFinalizar(orden.idOrden)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#6f9468] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f8059] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Marcar finalizada
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface DatoTiempoProps {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
}

function DatoTiempo({ icono, etiqueta, valor }: DatoTiempoProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-gray-600">
        {icono}

        <span className="text-sm">{etiqueta}</span>
      </div>

      <span className="text-sm font-medium text-gray-800">{valor}</span>
    </div>
  );
}

interface PasoProgresoProps {
  nombre: string;
  estadoActual: EstadoOrdenProduccion;
  estadoPaso: EstadoOrdenProduccion;
}

const ordenEstados: EstadoOrdenProduccion[] = ['PENDIENTE', 'EN_PRODUCCION', 'FINALIZADA'];

function PasoProgreso({ nombre, estadoActual, estadoPaso }: PasoProgresoProps) {
  const indiceActual = ordenEstados.indexOf(estadoActual);
  const indicePaso = ordenEstados.indexOf(estadoPaso);

  const completado = indicePaso < indiceActual;
  const actual = indicePaso === indiceActual;

  return (
    <div className="flex min-w-20 flex-col items-center text-center">
      <div
        className={[
          'flex h-10 w-10 items-center justify-center rounded-full border-2',
          completado
            ? 'border-[#496647] bg-[#496647] text-white'
            : actual
              ? 'border-[#496647] bg-white text-[#496647]'
              : 'border-gray-300 bg-gray-200 text-gray-400',
        ].join(' ')}
      >
        {completado ? (
          <Check className="h-5 w-5" />
        ) : actual ? (
          <Package className="h-5 w-5" />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-current" />
        )}
      </div>

      <p className="mt-2 text-xs font-medium text-gray-800">{nombre}</p>

      <p
        className={[
          'mt-0.5 text-[11px]',
          completado ? 'text-[#496647]' : actual ? 'text-gray-700' : 'text-gray-400',
        ].join(' ')}
      >
        {completado ? 'Completado' : actual ? 'Actual' : 'Pendiente'}
      </p>
    </div>
  );
}

function LineaProgreso({ activa }: { activa: boolean }) {
  return (
    <div
      className={[
        'mt-5 h-0.5 min-w-16',
        activa ? 'bg-[#496647]' : 'border-t-2 border-dashed border-gray-300',
      ].join(' ')}
    />
  );
}
