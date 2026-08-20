import { CalendarDays, CheckCircle2, CircleAlert, MoreVertical, Package } from 'lucide-react';
import { useState } from 'react';

import type { EstadoPedido, TarjetaPedido as TarjetaPedidoType } from '../../types/pedido.types';

interface TarjetaPedidoProps {
  pedido: TarjetaPedidoType;
  estado: EstadoPedido;
  onVerDetalle?: (idPedido: number) => void;
  onMarcarListoParaEntregar?: (idPedido: number) => void;
  onIniciarArrastre?: (pedido: TarjetaPedidoType, estado: EstadoPedido) => void;
  onFinalizarArrastre?: () => void;
}

const formatearFecha = (fecha: string) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha));
};

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

export default function TarjetaPedido({
  pedido,
  estado,
  onVerDetalle,
  onMarcarListoParaEntregar,
  onIniciarArrastre,
  onFinalizarArrastre,
}: TarjetaPedidoProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const puedeMarcarListoParaEntregar = estado === 'PENDIENTE' && !pedido.tieneFaltantesStock;

  const puedeArrastrarse = puedeMarcarListoParaEntregar;

  return (
    <article
      draggable={puedeArrastrarse}
      onDragStart={(event) => {
        if (!puedeArrastrarse) {
          event.preventDefault();
          return;
        }

        event.dataTransfer.effectAllowed = 'move';

        onIniciarArrastre?.(pedido, estado);
      }}
      onDragEnd={() => {
        onFinalizarArrastre?.();
      }}
      className={[
        'relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition',
        'hover:shadow-md',
        puedeArrastrarse ? 'cursor-grab active:cursor-grabbing' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            PED-{pedido.numeroPedido.toString().padStart(5, '0')}
          </p>

          <h3 className="mt-1 font-semibold text-gray-900">{pedido.cliente}</h3>
        </div>

        {puedeMarcarListoParaEntregar && (
          <div className="relative">
            <button
              type="button"
              aria-label="Más acciones"
              onClick={() => setMenuAbierto((abierto) => !abierto)}
              onMouseDown={(event) => event.stopPropagation()}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuAbierto && (
              <div className="absolute right-0 top-9 z-20 w-60 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setMenuAbierto(false);

                    onMarcarListoParaEntregar?.(pedido.numeroPedido);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#496647]" />
                  Marcar como listo para entregar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          <span>{formatearFecha(pedido.fecha)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-400" />

          <span>
            {pedido.cantidadProductos} {pedido.cantidadProductos === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-500">Total estimado</span>

          <span className="font-semibold text-gray-900">{formatearMoneda(pedido.total)}</span>
        </div>

        {pedido.tieneFaltantesStock && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
            <CircleAlert className="h-4 w-4 shrink-0" />
            Stock insuficiente
          </div>
        )}

        {onVerDetalle && (
          <button
            type="button"
            onClick={() => onVerDetalle(pedido.numeroPedido)}
            className="mt-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Ver detalle
          </button>
        )}
      </div>
    </article>
  );
}
