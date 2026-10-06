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
    <div className="flex flex-wrap gap-8">
      {/* Asientos registrados */}
      <article className="flex h-[82px] w-[215px] items-center gap-3 rounded-xl bg-white px-4 shadow-md">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[#4E6B4A]">
          <BookOpenCheck className="h-5 w-5" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <p className="whitespace-nowrap text-xs font-medium text-gray-800">
            Asientos registrados
          </p>

          <p className="mt-0.5 text-xl font-semibold leading-none text-[#4E6B4A]">
            {asientosRegistrados}
          </p>

          <p className="mt-1 text-[11px] text-gray-500">En total</p>
        </div>
      </article>

      {/* Pendientes */}
      <article className="flex h-[82px] w-[235px] items-center gap-3 rounded-xl bg-white px-4 shadow-md">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <Clock3 className="h-5 w-5" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center text-center">
          <p className="whitespace-nowrap text-xs font-medium text-gray-800">
            Pendientes de registrar
          </p>

          <p className="mt-0.5 text-xl font-semibold leading-none text-orange-500">
            {pendientesRegistrar}
          </p>

          <p className="mt-1 whitespace-nowrap text-[11px] text-gray-500">
            Requieren asiento contable
          </p>
        </div>
      </article>
    </div>
  );
}
