import { Search, SlidersHorizontal } from 'lucide-react';

import type { TipoFactura } from '../../types/facturacion.types';

interface FiltrosFacturacionProps {
  search: string;
  tipoFactura?: TipoFactura;
  mes?: number;
  hayFiltrosActivos: boolean;
  onSearchChange: (valor: string) => void;
  onTipoFacturaChange: (valor?: TipoFactura) => void;
  onMesChange: (valor?: number) => void;
  onLimpiarFiltros: () => void;
}

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export default function FiltrosFacturacion({
  search,
  tipoFactura,
  mes,
  hayFiltrosActivos,
  onSearchChange,
  onTipoFacturaChange,
  onMesChange,
  onLimpiarFiltros,
}: FiltrosFacturacionProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold text-abacontex-primary-two">Facturas emitidas</h2>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div>
          <label
            htmlFor="buscar-factura"
            className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
          >
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscar-factura"
              type="text"
              value={search}
              onChange={(event) => {
                const valor = event.target.value;

                const soloTexto = valor.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s'-]/g, '');

                onSearchChange(soloTexto);
              }}
              placeholder="Buscar por cliente..."
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20"
            />

            <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div>
          <label
            htmlFor="tipo-factura"
            className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
          >
            Tipos de facturas
          </label>

          <select
            id="tipo-factura"
            value={tipoFactura ?? ''}
            onChange={(event) =>
              onTipoFacturaChange(
                event.target.value === '' ? undefined : (event.target.value as TipoFactura)
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20"
          >
            <option value="">Todos</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="periodo-factura"
            className="mb-1.5 block text-sm font-medium text-abacontex-black-text"
          >
            Período
          </label>

          <select
            id="periodo-factura"
            value={mes ?? ''}
            onChange={(event) =>
              onMesChange(event.target.value === '' ? undefined : Number(event.target.value))
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-abacontex-primary-three focus:ring-2 focus:ring-abacontex-primary-three/20"
          >
            <option value="">Todos</option>

            {MESES.map((nombreMes, index) => (
              <option key={nombreMes} value={index + 1}>
                {nombreMes}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onLimpiarFiltros}
          disabled={!hayFiltrosActivos}
          className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-abacontex-primary-three transition hover:text-abacontex-primary-two disabled:cursor-not-allowed disabled:text-gray-300"
        >
          <SlidersHorizontal className="size-4" />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
