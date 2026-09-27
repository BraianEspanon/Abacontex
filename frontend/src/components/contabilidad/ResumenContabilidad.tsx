import { BookOpenCheck, Clock3 } from 'lucide-react';

interface ResumenContabilidadProps {
  asientosRegistrados: number;
  pendientesRegistrar: number;
}

export default function ResumenContabilidad({
  asientosRegistrados,
  pendientesRegistrar,
}: ResumenContabilidadProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Asientos registrados</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">{asientosRegistrados}</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ec] text-[#4E6B4A]">
            <BookOpenCheck className="h-5 w-5" />
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pendientes de registrar</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">{pendientesRegistrar}</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock3 className="h-5 w-5" />
          </div>
        </div>
      </article>
    </div>
  );
}
