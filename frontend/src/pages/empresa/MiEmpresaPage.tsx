import { ArrowRight, Building2, ChevronRight, CircleHelp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useEmpresaActual } from '../../hooks/useEmpresaActual';

export default function MiEmpresaPage() {
  const { data: empresa, isLoading: cargandoEmpresa, isError: errorEmpresa } = useEmpresaActual();

  const { data: alumno, isLoading: cargandoAlumno, isError: errorAlumno } = useAlumnoActual();

  const cargando = cargandoEmpresa || cargandoAlumno;
  const hayError = errorEmpresa || errorAlumno;

  if (cargando) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando empresa...</p>
      </div>
    );
  }

  const encabezado = (
    <>
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
    </>
  );

  if (hayError || !alumno) {
    return (
      <div className="space-y-5">
        {encabezado}

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

  /*
   * El alumno no pertenece a una empresa.
   *
   * Si es CEO, no corresponde mostrarle el mismo mensaje
   * que a un integrante común, porque tiene la responsabilidad
   * de crear la empresa.
   */
  if (!empresa) {
    const esCEO = alumno.rolEmpresa?.nombre.toUpperCase() === 'CEO';

    if (esCEO) {
      return (
        <div className="space-y-5">
          {encabezado}

          <div className="flex justify-center pt-6">
            <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
                <Building2 size={36} className="text-abacontex-primary" />
              </div>

              <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
                Todavía no creaste tu empresa
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
                Como Director Ejecutivo, tenés que crear la empresa de tu equipo antes de comenzar a
                trabajar en la simulación.
              </p>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
                Vas a poder definir su información principal, cargar el logo y conformar el equipo
                con tus compañeros.
              </p>

              <Link
                to="/alumno/empresa/crear"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-abacontex-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-abacontex-primary-two"
              >
                Crear mi empresa
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </div>
      );
    }

    /*
     * Alumno con un rol distinto de CEO.
     * Debe esperar a ser incorporado a una empresa.
     */
    return (
      <div className="space-y-5">
        {encabezado}

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
      {encabezado}

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
