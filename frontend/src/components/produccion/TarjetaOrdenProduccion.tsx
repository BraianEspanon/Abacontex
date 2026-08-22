import { CalendarDays, CheckCircle2, ChevronRight, CirclePlay } from 'lucide-react';

import type { EstadoOrdenProduccion, OrdenProduccionTarjeta } from '../../types/produccion.types';

interface TarjetaOrdenProduccionProps {
  orden: OrdenProduccionTarjeta;
  estado: EstadoOrdenProduccion;
  onVerDetalle: (idOrden: number) => void;
  onIniciar: (idOrden: number) => void;
  onFinalizar: (idOrden: number) => void;

  onIniciarArrastre?: (orden: OrdenProduccionTarjeta, estado: EstadoOrdenProduccion) => void;

  onFinalizarArrastre?: () => void;
}

const formatearFecha = (fecha: string) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha));
};

const clasesPrioridad: Record<OrdenProduccionTarjeta['prioridad'], string> = {
  ALTA: 'bg-red-50 text-red-600',
  MEDIA: 'bg-orange-50 text-orange-500',
  BAJA: 'bg-green-100 text-green-700',
};

const nombresPrioridad: Record<OrdenProduccionTarjeta['prioridad'], string> = {
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
};

export default function TarjetaOrdenProduccion({
  orden,
  estado,
  onVerDetalle,
  onIniciar,
  onFinalizar,
  onIniciarArrastre,
  onFinalizarArrastre,
}: TarjetaOrdenProduccionProps) {
  const puedeArrastrarse = estado === 'PENDIENTE' || estado === 'EN_PRODUCCION';

  return (
    <article
      draggable={puedeArrastrarse}
      onDragStart={(event) => {
        if (!puedeArrastrarse) {
          event.preventDefault();
          return;
        }

        event.dataTransfer.effectAllowed = 'move';

        onIniciarArrastre?.(orden, estado);
      }}
      onDragEnd={() => {
        onFinalizarArrastre?.();
      }}
      className={[
        'rounded-xl border border-gray-200 bg-white shadow-sm transition',
        'hover:shadow-md',
        puedeArrastrarse ? 'cursor-grab active:cursor-grabbing' : '',
      ].join(' ')}
    >
      <div className="px-4 pt-3.5">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#496647]">
              ORD-
              {orden.idOrden.toString().padStart(4, '0')}
            </p>

            <h3 className="mt-1 truncate text-sm font-semibold text-gray-900">
              {orden.productoNombre}
            </h3>
          </div>

          <span
            className={[
              'shrink-0 rounded-full px-3 py-1 text-[11px] font-medium',
              clasesPrioridad[orden.prioridad],
            ].join(' ')}
          >
            {nombresPrioridad[orden.prioridad]}
          </span>
        </div>

        {/* Información */}
        <div className="mt-3 space-y-1 text-xs text-gray-600">
          <p>
            Cantidad: <span className="font-medium text-gray-800">{orden.cantidad}</span>
          </p>

          {orden.pedidoId !== null && (
            <p>
              Pedido asociado:{' '}
              <span className="font-medium text-gray-800">
                PED-
                {orden.pedidoId.toString().padStart(5, '0')}
              </span>
            </p>
          )}

          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-gray-400" />

            <span>{formatearFecha(orden.fechaCreacion)}</span>
          </div>
        </div>

        {/* Acción operativa */}
        {(estado === 'PENDIENTE' || estado === 'EN_PRODUCCION') && (
          <div className="mt-3 flex justify-end">
            {estado === 'PENDIENTE' && (
              <button
                type="button"
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                onClick={() => onIniciar(orden.idOrden)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#496647] px-2.5 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#3d573c]"
              >
                <CirclePlay className="h-3.5 w-3.5" />
                Iniciar producción
              </button>
            )}

            {estado === 'EN_PRODUCCION' && (
              <button
                type="button"
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                onClick={() => onFinalizar(orden.idOrden)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#496647] px-2.5 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#3d573c]"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Marcar finalizada
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ver detalle */}
      <button
        type="button"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        onClick={() => onVerDetalle(orden.idOrden)}
        className="mt-3 flex w-full items-center justify-between border-t border-gray-200 px-4 py-2.5 text-xs text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
      >
        <span>Ver detalle</span>

        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}
