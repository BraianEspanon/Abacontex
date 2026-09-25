import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';

import type { CuentaContable } from '../../types/cuenta.types';

import { formatearNombreEnum } from '../../utils/texto.utils';

interface TablaCuentasProps {
  cuentas: CuentaContable[];

  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  hayFiltrosAplicados: boolean;

  onPageChange: (page: number) => void;

  onEditar?: (cuenta: CuentaContable) => void;
}

function generarPaginas(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages];
}

export default function TablaCuentas({
  cuentas,
  page,
  pageSize,
  totalItems,
  totalPages,
  hayFiltrosAplicados,
  onPageChange,
  onEditar,
}: TablaCuentasProps) {
  const inicio = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const fin = Math.min(page * pageSize, totalItems);

  const paginas = generarPaginas(page, totalPages);

  return (
    <section className="overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-100">
            <tr className="text-left text-xs font-semibold text-gray-700">
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Rubro</th>
              <th className="px-5 py-3">Descripción</th>

              {onEditar && (
                <th className="w-16 px-5 py-3 text-center">
                  <span className="sr-only">Acciones</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {cuentas.map((cuenta) => (
              <tr
                key={cuenta.idCuenta}
                className="text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-medium text-gray-900">{cuenta.codigo}</td>

                <td className="px-5 py-4 font-medium text-gray-900">{cuenta.nombre}</td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {formatearNombreEnum(cuenta.rubro.tipoCuenta.nombre)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                    {cuenta.rubro.nombre}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">{cuenta.descripcion}</td>

                {onEditar && (
                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onEditar(cuenta)}
                      aria-label={`Editar cuenta ${cuenta.nombre}`}
                      title="Editar cuenta"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-abacontex-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cuentas.length === 0 && (
        <div className="flex min-h-44 items-center justify-center px-6 text-center">
          <p className="text-sm text-gray-500">
            {hayFiltrosAplicados
              ? 'No se encontraron elementos que coincidan con los criterios de búsqueda.'
              : 'No hay cuentas disponibles en el Manual de Cuentas.'}
          </p>
        </div>
      )}

      <footer className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">
          {totalItems === 0
            ? 'Mostrando 0 cuentas'
            : `Mostrando ${inicio} a ${fin} de ${totalItems} cuentas`}
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {paginas.map((pagina, index) => {
              if (pagina === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 min-w-8 items-center justify-center px-1 text-xs text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pagina}
                  type="button"
                  onClick={() => onPageChange(pagina)}
                  className={[
                    'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition',
                    pagina === page ? 'bg-[#496647] text-white' : 'text-gray-600 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {pagina}
                </button>
              );
            })}

            <button
              type="button"
              aria-label="Página siguiente"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </footer>
    </section>
  );
}
