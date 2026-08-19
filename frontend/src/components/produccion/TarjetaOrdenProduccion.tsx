import { CalendarDays, ChevronRight, CirclePlay, CheckCircle2 } from 'lucide-react';

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
  ALTA: 'bg-red-100 text-red-700',
  MEDIA: 'bg-orange-100 text-orange-700',
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
        'rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md',
        puedeArrastrarse ? 'cursor-grab active:cursor-grabbing' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#496647]">
            ORD-{orden.idOrden.toString().padStart(4, '0')}
          </p>

          <h3 className="mt-1 text-sm font-semibold text-gray-900">{orden.productoNombre}</h3>
        </div>

        <span
          className={[
            'rounded-full px-3 py-1 text-xs font-medium',
            clasesPrioridad[orden.prioridad],
          ].join(' ')}
        >
          {nombresPrioridad[orden.prioridad]}
        </span>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-gray-600">
        <p>
          Cantidad: <span className="font-medium text-gray-800">{orden.cantidad}</span>
        </p>

        {orden.pedidoId !== null && (
          <p>
            Pedido asociado:{' '}
            <span className="font-medium text-gray-800">
              PED-{orden.pedidoId.toString().padStart(5, '0')}
            </span>
          </p>
        )}

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          <span>{formatearFecha(orden.fechaCreacion)}</span>
        </div>
      </div>

      {(estado === 'PENDIENTE' || estado === 'EN_PRODUCCION') && (
        <div className="mt-4 flex justify-end">
          {estado === 'PENDIENTE' && (
            <button
              type="button"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              onClick={() => onIniciar(orden.idOrden)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#496647] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#3d573c]"
            >
              <CirclePlay className="h-4 w-4" />
              Iniciar producción
            </button>
          )}

          {estado === 'EN_PRODUCCION' && (
            <button
              type="button"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              onClick={() => onFinalizar(orden.idOrden)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#496647] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#3d573c]"
            >
              <CheckCircle2 className="h-4 w-4" />
              Marcar finalizada
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        onClick={() => onVerDetalle(orden.idOrden)}
        className="mt-3 flex w-full items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-600 transition hover:text-gray-900"
      >
        <span>Ver detalle</span>

        <ChevronRight className="h-4 w-4" />
      </button>
    </article>
  );
}
