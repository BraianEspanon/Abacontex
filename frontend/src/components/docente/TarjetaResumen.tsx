import type { LucideIcon } from 'lucide-react';

interface TarjetaResumenProps {
  titulo: string;
  valor: string | number;
  textoInferior: string;
  icono: LucideIcon;
  destacado?: boolean;
}

export default function TarjetaResumen({
  titulo,
  valor,
  textoInferior,
  icono: Icono,
  destacado = false,
}: TarjetaResumenProps) {
  return (
    <article className="flex min-h-24 items-center gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8eee5] text-[#557650]">
        <Icono size={23} />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-600">{titulo}</p>

        <p
          className={[
            'mt-0.5 text-2xl font-semibold',
            destacado ? 'text-red-600' : 'text-[#1f2b22]',
          ].join(' ')}
        >
          {valor}
        </p>

        <p className="mt-1 text-xs text-[#5e8058]">{textoInferior}</p>
      </div>
    </article>
  );
}
