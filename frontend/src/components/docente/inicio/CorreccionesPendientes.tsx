import { Calculator, ClipboardCheck } from 'lucide-react';

const correcciones = [
  {
    id: 1,
    titulo: 'Ejercicios contables',
    cantidad: 12,
    prioridad: 'Urgente',
    icono: Calculator,
  },
  {
    id: 2,
    titulo: 'Simulaciones empresariales',
    cantidad: 6,
    prioridad: 'Media',
    icono: ClipboardCheck,
  },
];

export default function CorreccionesPendientes() {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-[#20251f]">Correcciones pendientes</h3>

      <div className="space-y-3">
        {correcciones.map((correccion) => {
          const Icono = correccion.icono;

          return (
            <div
              key={correccion.id}
              className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8eee5] text-[#557650]">
                <Icono size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#20251f]">{correccion.titulo}</p>

                <span
                  className={[
                    'mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    correccion.prioridad === 'Urgente'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-orange-100 text-orange-700',
                  ].join(' ')}
                >
                  {correccion.prioridad}
                </span>
              </div>

              <span className="text-lg font-semibold text-[#20251f]">{correccion.cantidad}</span>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-lg bg-[#64895e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#557650]"
      >
        Ir a correcciones
      </button>
    </article>
  );
}
