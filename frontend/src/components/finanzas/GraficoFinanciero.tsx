// src/components/finanzas/GraficoFinanciero.tsx

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useGraficoFinanciero } from '../../hooks/useGraficoFinanciero';

import type { PeriodoGraficoFinanciero } from '../../types/finanzas.types';

interface Props {
  periodo: PeriodoGraficoFinanciero;
  onPeriodoChange: (periodo: PeriodoGraficoFinanciero) => void;
}

const opciones: Array<{
  value: PeriodoGraficoFinanciero;
  label: string;
}> = [
  {
    value: 'mes',
    label: 'Último mes',
  },
  {
    value: '6meses',
    label: 'Últimos 6 meses',
  },
  {
    value: 'ciclo',
    label: 'Ciclo lectivo',
  },
];

const formatearMoneda = (valor: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor);

export default function GraficoFinanciero({ periodo, onPeriodoChange }: Props) {
  const { data = [], isLoading, isError } = useGraficoFinanciero(periodo);

  return (
    <section className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-base font-semibold text-abacontex-black-text">
          Ingresos vs Egresos
        </h2>

        <div className="inline-flex self-start overflow-hidden rounded-lg border border-gray-300">
          {opciones.map((opcion) => {
            const seleccionada = periodo === opcion.value;

            return (
              <button
                key={opcion.value}
                type="button"
                onClick={() => onPeriodoChange(opcion.value)}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition ${
                  seleccionada
                    ? 'bg-abacontex-primary-three text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {opcion.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          Cargando información financiera...
        </div>
      )}

      {isError && (
        <div className="flex h-72 items-center justify-center rounded-xl bg-red-50 px-6 text-center text-sm text-red-600">
          No se pudo cargar el gráfico financiero.
        </div>
      )}

      {!isLoading && !isError && data.length === 0 && (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <p className="font-medium text-gray-600">Todavía no hay movimientos financieros</p>

          <p className="mt-2 text-sm text-gray-400">
            Cuando registres ingresos o egresos, los vas a ver representados acá.
          </p>
        </div>
      )}

      {!isLoading && !isError && data.length > 0 && (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} />

              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />

              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(valor: number) => {
                  if (Math.abs(valor) >= 1000) {
                    return `$${Math.round(valor / 1000)}k`;
                  }

                  return `$${valor}`;
                }}
              />

              <Tooltip formatter={(value) => formatearMoneda(Number(value))} />

              <Legend verticalAlign="bottom" align="center" />

              <Bar dataKey="ingresos" name="Ingresos" fill="#6a8f65" radius={[5, 5, 0, 0]} />

              <Bar dataKey="egresos" name="Egresos" fill="#dc2626" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
