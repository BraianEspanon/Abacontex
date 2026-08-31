import { RotateCcw, Search } from 'lucide-react';
import type { FormEvent } from 'react';

import type { TipoCuentaConRubros } from '../../types/cuenta.types';

import { formatearNombreEnum } from '../../utils/texto.utils';

interface FiltrosCuentasProps {
  search: string;
  tipoCuentaId: number | null;
  rubroId: number | null;

  tiposCuenta: TipoCuentaConRubros[];

  onSearchChange: (value: string) => void;
  onTipoCuentaChange: (value: number | null) => void;
  onRubroChange: (value: number | null) => void;

  onBuscar: () => void;
  onLimpiar: () => void;
}

export default function FiltrosCuentas({
  search,
  tipoCuentaId,
  rubroId,
  tiposCuenta,
  onSearchChange,
  onTipoCuentaChange,
  onRubroChange,
  onBuscar,
  onLimpiar,
}: FiltrosCuentasProps) {
  const rubrosDisponibles = tipoCuentaId
    ? (tiposCuenta.find((tipo) => tipo.idTipoCuenta === tipoCuentaId)?.rubros ?? [])
    : tiposCuenta.flatMap((tipo) => tipo.rubros);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onBuscar();
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr_0.8fr_auto_auto] lg:items-end"
      >
        <div>
          <label htmlFor="nombreCuenta" className="mb-2 block text-sm font-medium text-gray-800">
            Nombre de la cuenta
          </label>

          <div className="relative">
            <input
              id="nombreCuenta"
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por nombre de cuenta..."
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
            />

            <Search
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tipoCuenta" className="mb-2 block text-sm font-medium text-gray-800">
            Tipo de cuenta
          </label>

          <select
            id="tipoCuenta"
            value={tipoCuentaId ?? ''}
            onChange={(event) => {
              const value = event.target.value;

              onTipoCuentaChange(value ? Number(value) : null);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
          >
            <option value="">Todos</option>

            {tiposCuenta.map((tipo) => (
              <option key={tipo.idTipoCuenta} value={tipo.idTipoCuenta}>
                {formatearNombreEnum(tipo.nombre)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rubroCuenta" className="mb-2 block text-sm font-medium text-gray-800">
            Rubro
          </label>

          <select
            id="rubroCuenta"
            value={rubroId ?? ''}
            onChange={(event) => {
              const value = event.target.value;

              onRubroChange(value ? Number(value) : null);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
          >
            <option value="">Todos</option>

            {rubrosDisponibles.map((rubro) => (
              <option key={rubro.idRubro} value={rubro.idRubro}>
                {rubro.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-[#6f9468] px-5 text-sm font-medium text-white transition hover:bg-[#5f8259]"
        >
          <Search className="h-4 w-4" />
          Buscar
        </button>

        <button
          type="button"
          onClick={onLimpiar}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl px-2 text-sm font-medium text-[#6f9468] transition hover:bg-[#6f9468]/10"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar filtros
        </button>
      </form>
    </section>
  );
}
