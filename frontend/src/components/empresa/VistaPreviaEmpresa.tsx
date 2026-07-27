import { Building2, UsersRound } from 'lucide-react';

interface VistaPreviaEmpresaProps {
  nombre: string;
  actividad: string;
  logoUrl: string | null;
  cantidadIntegrantes: number;
}

export default function VistaPreviaEmpresa({
  nombre,
  actividad,
  logoUrl,
  cantidadIntegrantes,
}: VistaPreviaEmpresaProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-abacontex-black-text">Vista previa</h2>

      <p className="mt-1 text-xs text-abacontex-gray-text">
        Así se verá tu empresa en la plataforma.
      </p>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            {logoUrl ? (
              <img src={logoUrl} alt={`Logo de ${nombre}`} className="h-full w-full object-cover" />
            ) : (
              <Building2 size={32} className="text-gray-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-2xl font-semibold text-abacontex-black-text">
              {nombre || 'Nombre de la empresa'}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm text-abacontex-gray-text">
              {actividad || 'Descripción de la empresa'}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-abacontex-gray-text">
                <UsersRound size={15} />
                {cantidadIntegrantes} {cantidadIntegrantes === 1 ? 'integrante' : 'integrantes'}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Empresa activa
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
