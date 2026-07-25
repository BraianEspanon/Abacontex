import { UsersRound } from 'lucide-react';

interface Integrante {
  id: string;
  nombre: string;
  apellido: string;
  rolEmpresa?: unknown;
}

interface ResumenIntegrantesProps {
  integrantes: Integrante[];
}

function obtenerNombreRol(rolEmpresa: unknown): string {
  if (!rolEmpresa || typeof rolEmpresa !== 'object') {
    return 'Sin rol asignado';
  }

  if ('nombreRol' in rolEmpresa && typeof rolEmpresa.nombreRol === 'string') {
    return rolEmpresa.nombreRol;
  }

  if ('nombre' in rolEmpresa && typeof rolEmpresa.nombre === 'string') {
    return rolEmpresa.nombre;
  }

  return 'Sin rol asignado';
}

export default function ResumenIntegrantes({ integrantes }: ResumenIntegrantesProps) {
  const integrantesVisibles = integrantes.slice(0, 4);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Integrantes reunidos</h2>

          <p className="mt-1 text-xs text-gray-500">Equipo actual de la empresa.</p>
        </div>

        <span className="flex items-center gap-1 text-xs text-gray-500">
          <UsersRound size={15} />

          {integrantes.length}
        </span>
      </div>

      {integrantes.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">La empresa todavía no tiene integrantes.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {integrantesVisibles.map((integrante) => {
            const iniciales =
              `${integrante.nombre.charAt(0)}${integrante.apellido.charAt(0)}`.toUpperCase();

            return (
              <div key={integrante.id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                  {iniciales}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {integrante.nombre} {integrante.apellido}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {obtenerNombreRol(integrante.rolEmpresa)}
                  </p>
                </div>
              </div>
            );
          })}

          {integrantes.length > integrantesVisibles.length && (
            <p className="text-xs text-gray-500">
              Y {integrantes.length - integrantesVisibles.length} más.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
