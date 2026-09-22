import { ChevronRight, Home, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import AgregarIntegranteModal from '../../components/empresa/AgregarIntegranteModal';
import CambiarRolModal from '../../components/empresa/CambiarRolModal';
import InvitacionesPendientes from '../../components/empresa/InvitacionesPendientes';
import TablaIntegrantesEmpresa from '../../components/empresa/TablaIntegrantesEmpresa';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useEmpresaActual } from '../../hooks/useEmpresaActual';
import { useInvitacionesEnviadas } from '../../hooks/useInvitacionesEnviadas';

import type { IntegranteEmpresa } from '../../api/empresa.api';

export default function EquipoEmpresaPage() {
  const [integranteSeleccionado, setIntegranteSeleccionado] = useState<IntegranteEmpresa | null>(
    null
  );

  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);

  const {
    data: empresa,
    isLoading: cargandoEmpresa,
    isError: errorEmpresa,
    refetch,
  } = useEmpresaActual();

  const { data: alumnoActual, isLoading: cargandoAlumno, isError: errorAlumno } = useAlumnoActual();

  const cargando = cargandoEmpresa || cargandoAlumno;
  const hayError = errorEmpresa || errorAlumno;

  const esCEO = alumnoActual?.rolEmpresa?.nombre.toUpperCase() === 'CEO';

  const {
    data: invitacionesEnviadas = [],
    isLoading: cargandoInvitaciones,
    isError: errorInvitaciones,
  } = useInvitacionesEnviadas(esCEO);

  if (cargando) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando equipo...</p>
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

        <Link to="/alumno/empresa" className="transition hover:text-gray-700">
          Mi empresa
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Equipo</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>

        <p className="mt-2 text-base text-gray-500">
          Consultá los integrantes y roles de tu empresa.
        </p>
      </header>
    </>
  );

  if (hayError || !alumnoActual) {
    return (
      <div className="space-y-5">
        {encabezado}

        <section className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-red-800">No pudimos cargar el equipo</h2>

          <p className="mt-2 text-sm text-red-700">
            Ocurrió un problema al consultar la información de la empresa.
          </p>

          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
          >
            Reintentar
          </button>
        </section>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="space-y-5">
        {encabezado}

        <section className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-abacontex-primary/10">
            <Users className="h-7 w-7 text-abacontex-primary" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            No tenés una empresa asignada
          </h2>

          <p className="mt-2 max-w-lg text-sm text-gray-500">
            Para consultar un equipo primero tenés que formar parte de una empresa.
          </p>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {encabezado}

        {/* Resumen de la empresa */}
        <section className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-200">
                {empresa.logoUrl ? (
                  <img
                    src={empresa.logoUrl}
                    alt={`Logo de ${empresa.nombre}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-gray-500">
                    {empresa.nombre.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-heading text-xl font-semibold text-abacontex-black-text">
                    {empresa.nombre}
                  </h2>

                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Activa
                  </span>
                </div>

                <p className="mt-1 text-sm text-abacontex-gray-text">{empresa.actividad}</p>

                <div className="mt-2 flex items-center gap-2 text-sm text-abacontex-gray-text">
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
                onClick={() => setModalAgregarAbierto(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-abacontex-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-abacontex-primary-two"
              >
                <Plus className="h-4 w-4" />
                Agregar integrante
              </button>
            )}
          </div>
        </section>

        {/* Integrantes */}
        <section>
          <div className="mb-4">
            <h2 className="font-heading text-xl font-semibold text-abacontex-black-text">
              Integrantes de la empresa
            </h2>

            <p className="mt-1 text-sm text-abacontex-gray-text">
              Consultá los integrantes y los roles asignados dentro de la empresa.
            </p>
          </div>

          <TablaIntegrantesEmpresa
            integrantes={empresa.integrantes}
            esCEO={esCEO}
            usuarioActualId={alumnoActual.id}
            onCambiarRol={setIntegranteSeleccionado}
          />
        </section>

        {/* Invitaciones pendientes */}
        {esCEO && (
          <section>
            <div className="mb-4">
              <h2 className="font-heading text-xl font-semibold text-abacontex-black-text">
                Invitaciones pendientes
              </h2>

              <p className="mt-1 text-sm text-abacontex-gray-text">
                Invitaciones enviadas que todavía no fueron aceptadas.
              </p>
            </div>

            <InvitacionesPendientes
              invitaciones={invitacionesEnviadas}
              cargando={cargandoInvitaciones}
              error={errorInvitaciones}
            />
          </section>
        )}
      </div>

      {/* Modal para cambiar el rol de un integrante */}
      <CambiarRolModal
        abierto={integranteSeleccionado !== null}
        integrante={integranteSeleccionado}
        onCerrar={() => setIntegranteSeleccionado(null)}
      />

      {/* Modal para agregar integrantes */}
      <AgregarIntegranteModal
        abierto={modalAgregarAbierto}
        onCerrar={() => setModalAgregarAbierto(false)}
      />
    </>
  );
}
