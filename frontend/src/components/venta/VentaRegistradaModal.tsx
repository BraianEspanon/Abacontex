import { Check, CircleDollarSign, PackageCheck, ReceiptText, UserRound, X } from 'lucide-react';

import type { VentaRegistrada } from '../../types/venta.types';

interface VentaRegistradaModalProps {
  abierto: boolean;
  venta: VentaRegistrada | null;
  onCerrar: () => void;
  onVerVenta: () => void;
  onCompletarFactura: () => void;
}

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

export default function VentaRegistradaModal({
  abierto,
  venta,
  onCerrar,
  onVerVenta,
  onCompletarFactura,
}: VentaRegistradaModalProps) {
  if (!abierto || !venta) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onMouseDown={onCerrar}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Cerrar */}
        <div className="flex justify-end px-5 pt-5">
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-7 pb-7">
          {/* Encabezado */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-9 w-9 text-[#5f8059]" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">¡Venta registrada con éxito!</h2>

            <p className="mt-2 text-sm text-gray-500">
              Se generó automáticamente el movimiento financiero correspondiente.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Ahora podés completar la factura asociada a esta venta.
            </p>
          </div>

          {/* Resumen */}
          <section className="mx-auto mt-6 max-w-sm rounded-xl bg-gray-50 p-4">
            <div className="space-y-4">
              <FilaResumen
                icono={<ReceiptText className="h-4 w-4" />}
                etiqueta="Venta"
                valor={`VEN-${venta.idVenta.toString().padStart(4, '0')}`}
              />

              <FilaResumen
                icono={<PackageCheck className="h-4 w-4" />}
                etiqueta="Pedido"
                valor={`PED-${venta.pedidoId.toString().padStart(5, '0')}`}
              />

              <FilaResumen
                icono={<UserRound className="h-4 w-4" />}
                etiqueta="Cliente"
                valor={venta.clienteNombre}
              />

              <FilaResumen
                icono={<CircleDollarSign className="h-4 w-4" />}
                etiqueta="Total"
                valor={formatearMoneda(Number(venta.totalFinal))}
                destacar
              />
            </div>
          </section>

          {/* Acciones */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onCompletarFactura}
              className="rounded-lg bg-[#6f9468] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f8059]"
            >
              Completar factura
            </button>

            <button
              type="button"
              onClick={onVerVenta}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Ver venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilaResumenProps {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
  destacar?: boolean;
}

function FilaResumen({ icono, etiqueta, valor, destacar = false }: FilaResumenProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-[#496647]">
          {icono}
        </div>

        <span className="text-sm font-medium text-gray-700">{etiqueta}</span>
      </div>

      <span
        className={['text-sm font-semibold', destacar ? 'text-[#496647]' : 'text-gray-700'].join(
          ' '
        )}
      >
        {valor}
      </span>
    </div>
  );
}
