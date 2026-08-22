import {
  CalendarDays,
  Check,
  CircleDollarSign,
  Package,
  ReceiptText,
  UserRound,
  X,
} from 'lucide-react';

import Button from '../ui/Button';

import type { PedidoCreado } from '../../types/pedido.types';

interface PedidoRegistradoModalProps {
  abierto: boolean;
  pedido: PedidoCreado | null;
  onIrAlTablero: () => void;
  onCrearOrdenProduccion: (idPedido: number) => void;
  onCerrar: () => void;
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

export default function PedidoRegistradoModal({
  abierto,
  pedido,
  onIrAlTablero,
  onCrearOrdenProduccion,
  onCerrar,
}: PedidoRegistradoModalProps) {
  if (!abierto || !pedido) {
    return null;
  }

  const tieneFaltantes = pedido.tieneFaltantesStock && pedido.faltantesStock.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pedido-registrado-titulo"
        className="
          relative
          max-h-[92vh]
          w-full
          max-w-[500px]
          overflow-y-auto
          rounded-[16px]
          bg-white
          shadow-2xl
        "
      >
        {/* Cerrar */}
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onCerrar}
          className="
            absolute
            right-5
            top-5
            z-10
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-md
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
        >
          <X className="h-[19px] w-[19px]" />
        </button>

        <div className="pb-6 pt-8">
          {/* CHECK + TÍTULO */}
          <div className="px-8 text-center">
            <div
              className="
                mx-auto
                flex
                h-[62px]
                w-[62px]
                items-center
                justify-center
                rounded-full
                bg-[#d5edcf]
              "
            >
              <Check className="h-9 w-9 text-[#557752]" strokeWidth={1.8} />
            </div>

            <h2
              id="pedido-registrado-titulo"
              className="mt-4 text-[20px] font-semibold text-gray-900"
            >
              ¡Pedido registrado con éxito!
            </h2>

            <div className="mx-auto mt-2 max-w-[340px]">
              {tieneFaltantes ? (
                <p className="text-[13px] leading-[17px] text-gray-500">
                  Algunos productos no tienen stock suficiente, por lo que será necesario crear una
                  orden de producción para completar el pedido.
                </p>
              ) : (
                <p className="text-[13px] leading-[17px] text-gray-500">
                  El pedido fue registrado correctamente y quedó disponible en el tablero.
                </p>
              )}
            </div>
          </div>

          {/* BLOQUE CENTRAL */}
          <div className="mx-auto mt-5 w-[calc(100%-48px)] max-w-[380px]">
            {/* RESUMEN */}
            <section
              className="
                rounded-[8px]
                border
                border-gray-200
                bg-white
                px-3.5
                py-3
                shadow-sm
              "
            >
              <div className="grid grid-cols-3 gap-x-3 gap-y-3">
                <DatoResumen
                  icono={<ReceiptText className="h-[18px] w-[18px]" />}
                  etiqueta="N.º"
                  valor={`PED-${pedido.numeroPedido.toString().padStart(5, '0')}`}
                />

                <DatoResumen
                  icono={<UserRound className="h-[18px] w-[18px]" />}
                  etiqueta="Cliente"
                  valor={pedido.cliente}
                />

                <DatoResumen
                  icono={<CalendarDays className="h-[18px] w-[18px]" />}
                  etiqueta="Fecha"
                  valor={formatearFecha(pedido.fecha)}
                />

                <DatoResumen
                  icono={<Package className="h-[18px] w-[18px]" />}
                  etiqueta="Productos"
                  valor={`${pedido.cantidadProductos} ${
                    pedido.cantidadProductos === 1 ? 'producto' : 'productos'
                  }`}
                />

                <DatoResumen
                  icono={<CircleDollarSign className="h-[18px] w-[18px]" />}
                  etiqueta="Total estimado"
                  valor={formatearMoneda(pedido.totalEstimado)}
                  className="col-span-2"
                />
              </div>
            </section>

            {/* FALTANTES */}
            {tieneFaltantes && (
              <section className="mt-3">
                <h3 className="mb-2 text-[12px] font-semibold text-[#557752]">
                  Productos con faltante
                </h3>

                <div
                  className="
                    overflow-hidden
                    rounded-[7px]
                    border
                    border-gray-200
                    bg-white
                  "
                >
                  <table className="w-full table-fixed">
                    <thead className="bg-[#f7f7f7]">
                      <tr className="text-[10px] font-medium text-gray-500">
                        <th className="w-[46%] px-3 py-[7px] text-left">Producto</th>

                        <th className="w-[18%] px-1 py-[7px] text-center">Solicitado</th>

                        <th className="w-[18%] px-1 py-[7px] text-center">Cubierto</th>

                        <th className="w-[18%] px-1 py-[7px] text-center">Faltante</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {pedido.faltantesStock.map((faltante) => (
                        <tr key={faltante.producto}>
                          <td className="px-3 py-2 text-[11px] font-medium text-gray-800">
                            {faltante.producto}
                          </td>

                          <td className="px-1 py-2 text-center text-[11px] text-gray-700">
                            {faltante.solicitado}
                          </td>

                          <td className="px-1 py-2 text-center text-[11px] text-gray-700">
                            {faltante.cubierto}
                          </td>

                          <td className="px-1 py-2 text-center text-[11px] font-semibold text-orange-600">
                            {faltante.faltante}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* BOTONES */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                type="button"
                label="Ir al tablero"
                variant="outline"
                onClick={onIrAlTablero}
                className="
                  !rounded-[6px]
                  !px-5
                  !py-2
                  !text-[12px]
                  !font-medium
                  !shadow-sm
                "
              />

              {tieneFaltantes && (
                <Button
                  type="button"
                  label="Crear orden de producción"
                  variant="solid"
                  onClick={() => onCrearOrdenProduccion(pedido.numeroPedido)}
                  className="
                    !rounded-[6px]
                    !px-5
                    !py-2
                    !text-[12px]
                    !font-medium
                    !shadow-sm
                  "
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DatoResumenProps {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
  className?: string;
}

function DatoResumen({ icono, etiqueta, valor, className = '' }: DatoResumenProps) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      {/* Ícono */}
      <div
        className="
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          text-gray-500
        "
      >
        {icono}
      </div>

      {/* Texto */}
      <div className="min-w-0">
        <p className="text-[10px] leading-[12px] text-gray-500">{etiqueta}</p>

        <p
          className="
            mt-[2px]
            truncate
            text-[11px]
            font-semibold
            leading-[13px]
            text-gray-900
          "
        >
          {valor}
        </p>
      </div>
    </div>
  );
}
