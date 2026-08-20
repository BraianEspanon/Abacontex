import { Eye } from 'lucide-react';

import type { VentaListado } from '../../types/venta.types';

interface TablaVentasProps {
  ventas: VentaListado[];
  onVerDetalle: (idVenta: number) => void;
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

export default function TablaVentas({ ventas, onVerDetalle }: TablaVentasProps) {
  if (ventas.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <th className="px-5 py-3">N° de venta</th>
              <th className="px-5 py-3">Pedido asociado</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Forma de pago</th>
              <th className="px-5 py-3 text-right">Monto total</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {ventas.map((venta) => (
              <tr key={venta.idVenta} className="transition hover:bg-gray-50">
                <td className="px-5 py-4">
                  <span className="font-semibold text-[#496647]">
                    VEN-{venta.idVenta.toString().padStart(4, '0')}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="font-medium text-[#496647]">
                    PED-{venta.pedidoId.toString().padStart(5, '0')}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-gray-800">{venta.cliente}</td>

                <td className="px-5 py-4 text-sm text-gray-600">{formatearFecha(venta.fecha)}</td>

                <td className="px-5 py-4 text-sm text-gray-700">{venta.metodoPago}</td>

                <td className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                  {formatearMoneda(venta.montoTotal)}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onVerDetalle(venta.idVenta)}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-100 px-5 py-3">
        <p className="text-xs text-gray-500">
          Mostrando {ventas.length} {ventas.length === 1 ? 'venta' : 'ventas'}.
        </p>
      </div>
    </section>
  );
}
