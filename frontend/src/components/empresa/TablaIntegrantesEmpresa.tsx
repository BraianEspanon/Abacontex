import { Pencil } from 'lucide-react';

import type { IntegranteEmpresa } from '../../api/empresa.api';

interface TablaIntegrantesEmpresaProps {
  integrantes: IntegranteEmpresa[];
  esCEO: boolean;
  usuarioActualId?: string;
  onCambiarRol: (integrante: IntegranteEmpresa) => void;
}

function obtenerIniciales(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function obtenerColorRol(nombreRol: string) {
  switch (nombreRol.toUpperCase()) {
    case 'CEO':
      return 'bg-green-50 text-green-700';

    case 'COO':
      return 'bg-blue-50 text-blue-700';

    case 'CFO':
      return 'bg-violet-50 text-violet-700';

    case 'CTO':
      return 'bg-cyan-50 text-cyan-700';

    case 'CCO':
      return 'bg-orange-50 text-orange-700';

    case 'CIO':
      return 'bg-indigo-50 text-indigo-700';

    case 'CMO':
      return 'bg-rose-50 text-rose-700';

    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function TablaIntegrantesEmpresa({
  integrantes,
  esCEO,
  usuarioActualId,
  onCambiarRol,
}: TablaIntegrantesEmpresaProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">
                Integrante
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Rol</th>

              {esCEO && (
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {integrantes.map((integrante) => {
              const esUsuarioActual = integrante.id === usuarioActualId;

              return (
                <tr key={integrante.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
                        {obtenerIniciales(integrante.nombre, integrante.apellido)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {integrante.nombre} {integrante.apellido}
                          </p>

                          {esUsuarioActual && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              Vos
                            </span>
                          )}
                        </div>

                        <p className="truncate text-sm text-gray-500">{integrante.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {integrante.rolEmpresa ? (
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${obtenerColorRol(
                          integrante.rolEmpresa.nombre
                        )}`}
                      >
                        {integrante.rolEmpresa.nombre}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Sin rol asignado</span>
                    )}
                  </td>

                  {esCEO && (
                    <td className="px-6 py-4 text-right">
                      {!esUsuarioActual ? (
                        <button
                          type="button"
                          onClick={() => onCambiarRol(integrante)}
                          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Cambiar rol
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
