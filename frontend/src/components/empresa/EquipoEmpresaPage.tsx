import { ChevronRight, Home, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import CambiarRolModal from '../../components/empresa/CambiarRolModal';
import TablaIntegrantesEmpresa from '../../components/empresa/TablaIntegrantesEmpresa';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useEmpresaActual } from '../../hooks/useEmpresaActual';

import type { IntegranteEmpresa } from '../../api/empresa.api';

export default function EquipoEmpresaPage() {
  const [integranteSeleccionado, setIntegranteSeleccionado] = useState<IntegranteEmpresa | null>(
    null
  );

  const {
    data: empresa,
    isLoading: cargandoEmpresa,
    isError: errorEmpresa,
    refetch,
  } = useEmpresaActual();

  const { data: alumnoActual, isLoading: cargandoAlumno } = useAlumnoActual();

  const cargando = cargandoEmpresa || cargandoAlumno;

  const esCEO = alumnoActual?.rolEmpresa?.nombre.toUpperCase() === 'CEO';

  if (cargando) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando equipo...</p>
      </div>
    );
  }

  if (errorEmpresa) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No se pudo cargar el equipo</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un problema al obtener la información de la empresa.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <Users className="mx-auto h-10 w-10 text-gray-400" />

        <h2 className="mt-4 text-lg font-semibold text-gray-900">No tenés una empresa asignada</h2>

        <p className="mt-2 text-sm text-gray-500">
          Para consultar un equipo primero debés pertenecer a una empresa.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link to="/alumno/empresa" className="transition hover:text-gray-700">
            Mi empresa
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Equipo</span>
        </nav>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex min-w-0 items-center gap-4">
              {empresa.logoUrl ? (
                <img
                  src={empresa.logoUrl}
                  alt={`Logo de ${empresa.nombre}`}
                  className="h-16 w-16 shrink-0 rounded-xl border border-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold text-white">
                  {empresa.nombre.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-semibold text-gray-900">{empresa.nombre}</h1>

                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Activa
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">{empresa.actividad}</p>

                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />

                  <span>
                    {empresa.integrantes.length}{' '}
                    {empresa.integrantes.length === 1 ? 'integrante' : 'integrantes'}
                  </span>
                </div>
              </div>
            </div>

            {esCEO && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
                Agregar integrante
              </button>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Integrantes de la empresa</h2>

            <p className="mt-1 text-sm text-gray-500">
              Consultá los integrantes y los roles asignados dentro de la empresa.
            </p>
          </div>

          <TablaIntegrantesEmpresa
            integrantes={empresa.integrantes}
            esCEO={esCEO}
            usuarioActualId={alumnoActual?.id}
            onCambiarRol={setIntegranteSeleccionado}
          />
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Invitaciones pendientes</h2>

            <p className="mt-1 text-sm text-gray-500">
              Invitaciones enviadas que todavía no fueron aceptadas.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              Las invitaciones pendientes se mostrarán en esta sección.
            </p>
          </div>
        </section>
      </div>

      <CambiarRolModal
        abierto={integranteSeleccionado !== null}
        integrante={integranteSeleccionado}
        onCerrar={() => setIntegranteSeleccionado(null)}
      />
    </>
  );
}
