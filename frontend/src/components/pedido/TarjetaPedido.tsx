import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Factory,
  MoreHorizontal,
  Package,
} from 'lucide-react';
import { useState } from 'react';

import type { EstadoPedido, TarjetaPedido as TarjetaPedidoType } from '../../types/pedido.types';

interface TarjetaPedidoProps {
  pedido: TarjetaPedidoType;
  estado: EstadoPedido;

  onVerDetalle?: (idPedido: number) => void;
  onCrearOrdenProduccion?: (idPedido: number) => void;
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
  onCrearOrdenProduccion,
  onMarcarListoParaEntregar,
  onIniciarArrastre,
  onFinalizarArrastre,
}: TarjetaPedidoProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const puedeMarcarListoParaEntregar = estado === 'PENDIENTE' && !pedido.tieneFaltantesStock;

  const puedeCrearOrdenProduccion = estado === 'PENDIENTE' && pedido.tieneFaltantesStock;

  const tieneAcciones = puedeCrearOrdenProduccion || puedeMarcarListoParaEntregar;

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
        'relative rounded-lg border border-gray-200 bg-white shadow-sm transition',
        'hover:shadow-md',
        puedeArrastrarse ? 'cursor-grab active:cursor-grabbing' : '',
      ].join(' ')}
    >
      {/* Contenido */}
      <div className="p-3">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#496647]">
              PED-
              {pedido.numeroPedido.toString().padStart(5, '0')}
            </p>

            <h3 className="mt-1 truncate text-sm font-semibold text-gray-900">{pedido.cliente}</h3>
          </div>

          {tieneAcciones && (
            <div className="relative shrink-0">
              <button
                type="button"
                aria-label="Más acciones"
                onClick={(event) => {
                  event.stopPropagation();

                  setMenuAbierto((abierto) => !abierto);
                }}
                onMouseDown={(event) => event.stopPropagation()}
                className="rounded-md p-1 text-gray-600 transition hover:bg-gray-100"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {menuAbierto && (
                <div className="absolute right-0 top-7 z-30 w-56 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                  {puedeCrearOrdenProduccion && onCrearOrdenProduccion && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        setMenuAbierto(false);

                        onCrearOrdenProduccion(pedido.numeroPedido);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <Factory className="h-4 w-4 text-[#496647]" />
                      Crear orden de producción
                    </button>
                  )}

                  {puedeMarcarListoParaEntregar && onMarcarListoParaEntregar && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        setMenuAbierto(false);

                        onMarcarListoParaEntregar(pedido.numeroPedido);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#496647]" />
                      Listo para entregar
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cantidad */}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
          <Package className="h-3.5 w-3.5 text-gray-400" />

          <span>
            {pedido.cantidadProductos} {pedido.cantidadProductos === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Fecha + total */}
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarDays className="h-3.5 w-3.5 text-gray-400" />

            <span>{formatearFecha(pedido.fecha)}</span>
          </div>

          <span className="text-xs font-semibold text-gray-900">
            {formatearMoneda(pedido.total)}
          </span>
        </div>

        {/* Stock insuficiente */}
        {pedido.tieneFaltantesStock && (
          <div className="mt-2 flex w-fit items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">
            <CircleAlert className="h-3 w-3" />
            Stock insuficiente
          </div>
        )}
      </div>

      {/* Ver detalle */}
      {onVerDetalle && (
        <button
          type="button"
          onClick={() => onVerDetalle(pedido.numeroPedido)}
          className="flex w-full items-center justify-between border-t border-gray-200 px-3 py-2 text-xs text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <span>Ver detalle</span>

          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </article>
  );
}
