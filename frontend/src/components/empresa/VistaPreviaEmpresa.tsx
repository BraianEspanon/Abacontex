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
      <h2 className="text-sm font-semibold text-gray-700">Vista previa</h2>

      <p className="mt-1 text-xs text-gray-500">Así se verá tu empresa en la plataforma.</p>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            {logoUrl ? (
              <img src={logoUrl} alt={`Logo de ${nombre}`} className="h-full w-full object-cover" />
            ) : (
              <Building2 size={32} className="text-gray-400" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-serif text-2xl font-semibold text-gray-900">
              {nombre || 'Nombre de la empresa'}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {actividad || 'Descripción de la empresa'}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <UsersRound size={15} />

              <span>
                {cantidadIntegrantes} {cantidadIntegrantes === 1 ? 'integrante' : 'integrantes'}
              </span>

              <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                Empresa activa
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
