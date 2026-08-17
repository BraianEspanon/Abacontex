import { BadgeDollarSign, BarChart3, CalendarDays, ReceiptText } from 'lucide-react';

import type { ResumenVentas as ResumenVentasType } from '../../types/venta.types';

interface ResumenVentasProps {
  resumen: ResumenVentasType;
}

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

export default function ResumenVentas({ resumen }: ResumenVentasProps) {
  const tarjetas = [
    {
      titulo: 'Ventas registradas',
      valor: resumen.ventasRegistradas.toString(),
      descripcion: 'Total de operaciones confirmadas',
      icono: ReceiptText,
    },
    {
      titulo: 'Total vendido',
      valor: formatearMoneda(resumen.totalVendido),
      descripcion: 'Importe acumulado de ventas',
      icono: BadgeDollarSign,
    },
    {
      titulo: 'Ventas del mes',
      valor: resumen.ventasMes.toString(),
      descripcion: 'Operaciones del mes actual',
      icono: CalendarDays,
    },
    {
      titulo: 'Promedio por venta',
      valor: formatearMoneda(resumen.promedioVenta),
      descripcion: 'Importe promedio por operación',
      icono: BarChart3,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tarjetas.map((tarjeta) => {
        const Icono = tarjeta.icono;

        return (
          <article
            key={tarjeta.titulo}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{tarjeta.titulo}</p>

                <p className="mt-2 text-2xl font-bold text-gray-900">{tarjeta.valor}</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3eb] text-[#496647]">
                <Icono className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">{tarjeta.descripcion}</p>
          </article>
        );
      })}
    </section>
  );
}
