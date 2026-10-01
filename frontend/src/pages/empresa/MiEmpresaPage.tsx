import { ArrowRight, Building2, ChevronRight, CircleHelp, Home, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AgregarIntegranteModal from '../../components/empresa/AgregarIntegranteModal';
import Button from '../../components/ui/Button';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useEmpresaActual } from '../../hooks/useEmpresaActual';

function obtenerIniciales(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function obtenerClasesRol(nombreRol?: string) {
  switch (nombreRol?.toUpperCase()) {
    case 'CEO':
      return 'bg-emerald-50 text-emerald-700';

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
      return 'bg-pink-50 text-pink-700';

    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function MiEmpresaPage() {
  const navigate = useNavigate();

  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);

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

              <Button
                type="button"
                label="Crear mi empresa"
                variant="solid"
                icon={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate('/alumno/empresa/crear')}
                className="mt-7"
              />
            </section>
          </div>
        </div>
      );
    }

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

  const esCEO = alumno.rolEmpresa?.nombre.toUpperCase() === 'CEO';

  return (
    <>
      <div className="space-y-5">
        {encabezado}

        {/* Información principal de la empresa */}
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

            <Button
              type="button"
              label="Editar empresa"
              variant="solid"
              onClick={() => navigate('/alumno/empresa/editar')}
            />
          </div>
        </section>

        {/* Mi equipo */}
        <section className="max-w-3xl rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold text-abacontex-black-text">
                Mi equipo
              </h2>

              <p className="mt-1 text-sm text-abacontex-gray-text">
                Integrantes que forman parte de tu empresa.
              </p>
            </div>

            <Link
              to="/alumno/empresa/equipo"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-abacontex-primary transition hover:text-abacontex-primary-two"
            >
              Ver equipo completo
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="my-5 border-t border-gray-200" />

          {/* Resumen de integrantes */}
          <div className="space-y-1">
            {empresa.integrantes.map((integrante) => {
              const esUsuarioActual = integrante.id === alumno.id;

              return (
                <div
                  key={integrante.id}
                  className="flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
                      {obtenerIniciales(integrante.nombre, integrante.apellido)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {integrante.nombre} {integrante.apellido}
                        </p>

                        {esUsuarioActual && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                            Vos
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 truncate text-xs text-gray-500">{integrante.email}</p>
                    </div>
                  </div>

                  {integrante.rolEmpresa ? (
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${obtenerClasesRol(
                        integrante.rolEmpresa.nombre
                      )}`}
                    >
                      {integrante.rolEmpresa.nombre}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-gray-400">Sin rol</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-abacontex-gray-text">
              <Users className="h-4 w-4" />

              <span>
                <strong className="font-semibold text-abacontex-black-text">
                  {empresa.integrantes.length}
                </strong>{' '}
                {empresa.integrantes.length === 1 ? 'integrante' : 'integrantes'}
              </span>
            </div>

            {esCEO && (
              <Button
                type="button"
                label="Agregar integrante"
                variant="solid"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setModalAgregarAbierto(true)}
                className="px-4 py-2 text-sm"
              />
            )}
          </div>
        </section>
      </div>

      {/* Mismo modal utilizado en la pantalla Equipo */}
      <AgregarIntegranteModal
        abierto={modalAgregarAbierto}
        onCerrar={() => setModalAgregarAbierto(false)}
      />
    </>
  );
}
