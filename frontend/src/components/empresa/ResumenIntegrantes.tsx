import { UsersRound } from 'lucide-react';

import type { IntegranteEmpresa } from '../../api/empresa.api';

interface ResumenIntegrantesProps {
  integrantes: IntegranteEmpresa[];
}

export default function ResumenIntegrantes({ integrantes }: ResumenIntegrantesProps) {
  const integrantesVisibles = integrantes.slice(0, 4);

  const rolesPrincipales = Array.from(
    new Set(
      integrantes
        .map((integrante) => integrante.rolEmpresa?.nombre)
        .filter((rol): rol is string => Boolean(rol))
    )
  ).slice(0, 4);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
      <div className="flex items-center justify-between gap-4">
        <h2 className="whitespace-nowrap text-sm font-semibold text-abacontex-black-text">
          Integrantes resumidos
        </h2>

        <button
          type="button"
          className="whitespace-nowrap rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-50"
        >
          Ver equipo completo
        </button>
      </div>

      {integrantes.length === 0 ? (
        <p className="mt-4 text-sm text-abacontex-gray-text">
          La empresa todavía no tiene integrantes.
        </p>
      ) : (
        <>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex -space-x-2">
              {integrantesVisibles.map((integrante) => {
                const iniciales =
                  `${integrante.nombre.charAt(0)}${integrante.apellido.charAt(0)}`.toUpperCase();

                return (
                  <div
                    key={integrante.id}
                    title={`${integrante.nombre} ${integrante.apellido}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-semibold text-gray-600"
                  >
                    {iniciales}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-1 text-sm text-abacontex-gray-text">
              <UsersRound size={16} />

              <span>
                {integrantes.length} {integrantes.length === 1 ? 'integrante' : 'integrantes'}
              </span>
            </div>
          </div>

          {rolesPrincipales.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-medium text-abacontex-gray-text">
                Roles principales del equipo
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {rolesPrincipales.map((rol) => (
                  <span
                    key={rol}
                    className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                  >
                    {rol}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
