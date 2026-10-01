import { ChevronRight, Home, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import AgregarIntegranteModal from '../../components/empresa/AgregarIntegranteModal';
import CambiarRolModal from '../../components/empresa/CambiarRolModal';
import InvitacionesPendientes from '../../components/empresa/InvitacionesPendientes';
import TablaIntegrantesEmpresa from '../../components/empresa/TablaIntegrantesEmpresa';
import Button from '../../components/ui/Button';

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

      <span className="font-semibold text-gray-900">Equipo</span>
    </nav>
  );

  if (hayError || !alumnoActual) {
    return (
      <div className="space-y-6">
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
      <div className="space-y-6">
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
      <div className="space-y-6">
        {/* Breadcrumb */}
        {encabezado}

        {/* Resumen de la empresa */}
        <section className="rounded-xl bg-white px-6 py-6 shadow-md">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center">
              {/* Logo */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
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

              {/* Información de la empresa */}
              <div className="ml-5 min-w-0">
                <h2 className="truncate font-heading text-2xl font-semibold text-abacontex-black-text">
                  {empresa.nombre}
                </h2>

                <p className="mt-1 text-sm text-abacontex-gray-text">{empresa.actividad}</p>

                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Empresa activa
                </span>
              </div>
            </div>

            {/* Cantidad de integrantes */}
            <div className="flex items-center gap-5 lg:border-l lg:border-gray-300 lg:pl-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-gray-500" />

                <div>
                  <p className="text-2xl font-bold leading-none text-gray-900">
                    {empresa.integrantes.length}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {empresa.integrantes.length === 1 ? 'Integrante' : 'Integrantes'}
                  </p>
                </div>
              </div>
            </div>

            {/* Agregar integrante - solo CEO */}
            {esCEO && (
              <Button
                type="button"
                label="Agregar integrante"
                variant="solid"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setModalAgregarAbierto(true)}
                className="shrink-0 px-5 py-2.5 text-sm"
              />
            )}
          </div>
        </section>

        {/* Integrantes */}
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="font-heading text-lg font-semibold text-abacontex-black-text">
            Integrantes de la empresa
          </h2>

          <div className="mt-5">
            <TablaIntegrantesEmpresa
              integrantes={empresa.integrantes}
              esCEO={esCEO}
              usuarioActualId={alumnoActual.id}
              onCambiarRol={setIntegranteSeleccionado}
            />
          </div>
        </section>

        {/* Invitaciones pendientes - solo CEO */}
        {esCEO && (
          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="font-heading text-lg font-semibold text-abacontex-black-text">
              Invitaciones pendientes
            </h2>

            <div className="mt-5">
              <InvitacionesPendientes
                invitaciones={invitacionesEnviadas}
                cargando={cargandoInvitaciones}
                error={errorInvitaciones}
              />
            </div>
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
