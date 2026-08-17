import { RotateCcw, Search } from 'lucide-react';

interface FiltrosVentasProps {
  search: string;
  metodoPagoId: number | null;
  mes: number | null;

  onSearchChange: (value: string) => void;
  onMetodoPagoChange: (value: number | null) => void;
  onMesChange: (value: number | null) => void;
  onLimpiar: () => void;
}

const meses = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

export interface MetodoPagoFiltro {
  id: number;
  nombre: string;
}

interface FiltrosVentasExtendidosProps extends FiltrosVentasProps {
  metodosPago: MetodoPagoFiltro[];
}

export default function FiltrosVentas({
  search,
  metodoPagoId,
  mes,
  metodosPago,
  onSearchChange,
  onMetodoPagoChange,
  onMesChange,
  onLimpiar,
}: FiltrosVentasExtendidosProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto] lg:items-end">
        <div>
          <label htmlFor="buscarVenta" className="mb-2 block text-sm font-medium text-gray-800">
            Buscar
          </label>

          <div className="relative">
            <input
              id="buscarVenta"
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por cliente o n° de venta..."
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
            />

            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="metodoPago" className="mb-2 block text-sm font-medium text-gray-800">
            Forma de pago
          </label>

          <select
            id="metodoPago"
            value={metodoPagoId ?? ''}
            onChange={(event) =>
              onMetodoPagoChange(event.target.value === '' ? null : Number(event.target.value))
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
          >
            <option value="">Todas</option>

            {metodosPago.map((metodo) => (
              <option key={metodo.id} value={metodo.id}>
                {metodo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mesVenta" className="mb-2 block text-sm font-medium text-gray-800">
            Período
          </label>

          <select
            id="mesVenta"
            value={mes ?? ''}
            onChange={(event) =>
              onMesChange(event.target.value === '' ? null : Number(event.target.value))
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
          >
            <option value="">Todos</option>

            {meses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onLimpiar}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[#496647] transition hover:bg-[#edf3eb]"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
