import { Building2, CheckCircle2, CircleAlert } from 'lucide-react';

interface ResumenEmpresasProps {
  total: number;
  activas: number | null;
  inactivas: number | null;
}

export default function ResumenEmpresas({ total, activas, inactivas }: ResumenEmpresasProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <article className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef3ee] text-[#769a75]">
            <Building2 size={20} />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500">Empresas totales</p>

            <p className="mt-1 text-2xl font-semibold text-gray-900">{total}</p>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef3ee] text-[#769a75]">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500">Empresas activas</p>

            <p className="mt-1 text-2xl font-semibold text-gray-900">{activas ?? '-'}</p>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fce9e8] text-[#c94a4a]">
            <CircleAlert size={20} />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500">Empresas inactivas</p>

            <p className="mt-1 text-2xl font-semibold text-gray-900">{inactivas ?? '-'}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
