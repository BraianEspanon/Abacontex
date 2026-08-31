import { CalendarDays, CircleDollarSign, PiggyBank, ReceiptText } from 'lucide-react';

import type { ResumenFinanciero as ResumenFinancieroType } from '../../types/finanzas.types';

interface Props {
  resumen?: ResumenFinancieroType;
  isLoading: boolean;
}

const formatearMoneda = (valor: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);

export default function ResumenFinanciero({ resumen, isLoading }: Props) {
  const totalIngresos = resumen?.totalIngresos ?? 0;
  const totalEgresos = resumen?.totalEgresos ?? 0;
  const flujoNeto = resumen?.flujoNeto ?? 0;
  const ingresosMes = resumen?.mesActual.ingresos ?? 0;
  const egresosMes = resumen?.mesActual.egresos ?? 0;

  const tarjetas = [
    {
      titulo: 'Total de ingresos',
      valor: formatearMoneda(totalIngresos),
      descripcion: 'Total acumulado',
      icono: ReceiptText,
      claseValor: 'text-abacontex-primary',
    },
    {
      titulo: 'Total egresos',
      valor: formatearMoneda(totalEgresos),
      descripcion: 'Total acumulado',
      icono: CircleDollarSign,
      claseValor: 'text-red-600',
    },
    {
      titulo: 'Flujo neto',
      valor: formatearMoneda(flujoNeto),
      descripcion: '',
      icono: CalendarDays,
      claseValor: flujoNeto < 0 ? 'text-red-600' : 'text-abacontex-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {tarjetas.map(({ titulo, valor, descripcion, icono: Icono, claseValor }) => (
        <article
          key={titulo}
          className="flex min-h-24 items-center gap-4 rounded-xl bg-white px-5 py-4 shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <Icono size={21} className="text-abacontex-primary" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 sm:text-sm">{titulo}</p>

            <p className={`mt-1 text-xl font-semibold ${claseValor}`}>
              {isLoading ? '...' : valor}
            </p>

            {descripcion && <p className="mt-1 text-xs text-gray-400">{descripcion}</p>}
          </div>
        </article>
      ))}

      <article className="flex min-h-24 items-center gap-4 rounded-xl bg-white px-5 py-4 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <PiggyBank size={21} className="text-abacontex-primary" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-700 sm:text-sm">Mes actual</p>

          {isLoading ? (
            <p className="mt-1 text-xl font-semibold text-gray-400">...</p>
          ) : (
            <>
              <p className="mt-1 text-lg font-semibold text-abacontex-primary">
                +{formatearMoneda(ingresosMes)}
              </p>

              <p className="text-lg font-semibold text-red-600">-{formatearMoneda(egresosMes)}</p>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
