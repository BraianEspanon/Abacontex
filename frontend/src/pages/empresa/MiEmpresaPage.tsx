import { Link } from 'react-router-dom';

import { useEmpresaActual } from '../../hooks/useEmpresaActual';

export default function MiEmpresaPage() {
  const { data: empresa, isLoading, isError } = useEmpresaActual();

  if (isLoading) {
    return <div className="p-6">Cargando empresa...</div>;
  }

  if (isError || !empresa) {
    return <div className="p-6">No se pudo cargar la empresa.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-abacontex-black-text">Mi empresa</h1>

        <p className="mt-1 text-sm text-abacontex-gray-text">
          Consultá la información principal de tu empresa.
        </p>
      </div>

      <section className="max-w-3xl rounded-2xl bg-white p-6 shadow-md">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-200">
            {empresa.logoUrl ? (
              <img
                src={empresa.logoUrl}
                alt={`Logo de ${empresa.nombre}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-gray-500">
                {empresa.nombre.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h2 className="font-heading text-2xl font-semibold text-abacontex-black-text">
              {empresa.nombre}
            </h2>

            <p className="mt-2 text-sm text-abacontex-gray-text">{empresa.actividad}</p>

            <p className="mt-3 text-sm text-abacontex-gray-text">
              {empresa.integrantes.length}{' '}
              {empresa.integrantes.length === 1 ? 'integrante' : 'integrantes'}
            </p>
          </div>

          <Link
            to="/alumno/empresa/editar"
            className="rounded-lg bg-abacontex-primary px-5 py-2.5 text-center font-medium text-white transition hover:bg-abacontex-primary-two"
          >
            Editar empresa
          </Link>
        </div>
      </section>
    </div>
  );
}
