import { Building2, ChevronRight, CircleHelp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useEmpresaActual } from '../../hooks/useEmpresaActual';

export default function MiEmpresaPage() {
  const { data: empresa, isLoading, isError } = useEmpresaActual();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando empresa...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-5">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Mi empresa</span>
        </nav>

        <header>
          <h1 className="text-2xl font-bold text-gray-900">Mi empresa</h1>

          <p className="mt-2 text-base text-gray-500">
            Consultá la información principal de tu empresa.
          </p>
        </header>

        <div className="flex justify-center pt-6">
          <section className="w-full max-w-2xl rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                <CircleHelp size={24} className="text-red-500" />
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-abacontex-black-text">
                  No pudimos cargar tu empresa
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-abacontex-gray-text">
                  Ocurrió un problema al consultar la información de tu empresa. Intentá nuevamente
                  en unos minutos.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="space-y-5">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Mi empresa</span>
        </nav>

        <header>
          <h1 className="text-2xl font-bold text-gray-900">Mi empresa</h1>

          <p className="mt-2 text-base text-gray-500">
            Consultá la información principal de tu empresa.
          </p>
        </header>

        <div className="flex justify-center pt-6">
          <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
              <Building2 size={36} className="text-abacontex-primary" />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
              Todavía no pertenecés a una empresa
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
              Actualmente no formás parte de ninguna empresa de tu curso. Cuando seas incorporado a
              una empresa, vas a poder consultar desde acá toda su información.
            </p>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
              Si recibiste una invitación para unirte a una empresa, completá el proceso desde la
              invitación correspondiente.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-abacontex-gray-text">
              <Building2 className="h-4 w-4 text-abacontex-primary" />

              <span>
                El acceso a la empresa se habilitará automáticamente cuando formes parte de una.
              </span>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Mi empresa</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Mi empresa</h1>

        <p className="mt-2 text-base text-gray-500">
          Consultá la información principal de tu empresa.
        </p>
      </header>

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
