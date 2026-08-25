import { BadgeDollarSign, BarChart3, CalendarDays, ShoppingCart } from 'lucide-react';

import type { ResumenVentas as ResumenVentasType } from '../../types/venta.types';

interface ResumenVentasProps {
  resumen: ResumenVentasType;
}

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor);
};

export default function ResumenVentas({ resumen }: ResumenVentasProps) {
  const tarjetas = [
    {
      titulo: 'Ventas registradas',
      valor: resumen.ventasRegistradas.toString(),
      icono: ShoppingCart,
    },
    {
      titulo: 'Total vendido',
      valor: formatearMoneda(resumen.totalVendido),
      icono: BadgeDollarSign,
    },
    {
      titulo: 'Ventas del mes',
      valor: resumen.ventasMes.toString(),
      icono: CalendarDays,
    },
    {
      titulo: 'Promedio por venta',
      valor: formatearMoneda(resumen.promedioVenta),
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
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[#496647]">
                <Icono className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">{tarjeta.titulo}</p>

                <p className="mt-0.5 text-xl font-semibold text-[#496647]">{tarjeta.valor}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
