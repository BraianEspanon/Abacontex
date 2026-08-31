import { SlidersHorizontal, X } from 'lucide-react';

import type { TipoMovimiento } from '../../types/finanzas.types';

interface Props {
  tiposMovimiento: TipoMovimiento[];
  idTipoMovimiento: number | null;
  mes: number | null;
  onTipoMovimientoChange: (idTipoMovimiento: number | null) => void;
  onMesChange: (mes: number | null) => void;
  onLimpiar: () => void;
}

const meses = [
  { numero: 1, nombre: 'Enero' },
  { numero: 2, nombre: 'Febrero' },
  { numero: 3, nombre: 'Marzo' },
  { numero: 4, nombre: 'Abril' },
  { numero: 5, nombre: 'Mayo' },
  { numero: 6, nombre: 'Junio' },
  { numero: 7, nombre: 'Julio' },
  { numero: 8, nombre: 'Agosto' },
  { numero: 9, nombre: 'Septiembre' },
  { numero: 10, nombre: 'Octubre' },
  { numero: 11, nombre: 'Noviembre' },
  { numero: 12, nombre: 'Diciembre' },
];

export default function FiltrosMovimientos({
  tiposMovimiento,
  idTipoMovimiento,
  mes,
  onTipoMovimientoChange,
  onMesChange,
  onLimpiar,
}: Props) {
  const hayFiltros = idTipoMovimiento !== null || mes !== null;

  return (
    <section className="rounded-2xl bg-white px-5 py-4 shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div>
            <label
              htmlFor="tipo-movimiento"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Tipo de movimiento
            </label>

            <select
              id="tipo-movimiento"
              value={idTipoMovimiento ?? ''}
              onChange={(event) => {
                const valor = event.target.value;

                onTipoMovimientoChange(valor ? Number(valor) : null);
              }}
              className="min-w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-abacontex-primary"
            >
              <option value="">Todos</option>

              {tiposMovimiento.map((tipo) => (
                <option key={tipo.idTipoMovimiento} value={tipo.idTipoMovimiento}>
                  {tipo.nombre.charAt(0) + tipo.nombre.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="mes-movimiento"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Período
            </label>

            <select
              id="mes-movimiento"
              value={mes ?? ''}
              onChange={(event) => {
                const valor = event.target.value;

                onMesChange(valor ? Number(valor) : null);
              }}
              className="min-w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-abacontex-primary"
            >
              <option value="">Todos los meses</option>

              {meses.map((item) => (
                <option key={item.numero} value={item.numero}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onLimpiar}
          disabled={!hayFiltros}
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-abacontex-primary transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40 lg:self-auto"
        >
          {hayFiltros ? <X size={16} /> : <SlidersHorizontal size={16} />}
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
