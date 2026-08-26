import { ChevronRight, Factory, GraduationCap, Home, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import DetalleOrdenProduccionModal from '../../components/produccion/DetalleOrdenProduccionModal';
import PlanProduccionAnual from '../../components/produccion/PlanProduccionAnual';
import ResumenOrdenesProduccion from '../../components/produccion/ResumenOrdenesProduccion';
import TableroProduccion from '../../components/produccion/TableroProduccion';
import Button from '../../components/ui/Button';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useDetalleOrdenProduccion } from '../../hooks/useDetalleOrdenProduccion';
import { useFinalizarOrdenProduccion } from '../../hooks/useFinalizarOrdenProduccion';
import { useIniciarOrdenProduccion } from '../../hooks/useIniciarOrdenProduccion';
import { usePlanificacionAnual } from '../../hooks/usePlanificacionAnual';
import { useProduccion } from '../../hooks/useProduccion';

import { esCursoSexto } from '../../utils/curso.utils';

export default function ProduccionPage() {
  const navigate = useNavigate();

  const [idOrdenSeleccionada, setIdOrdenSeleccionada] = useState<number | null>(null);

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const esSexto = esCursoSexto(alumno?.curso?.nombre);

  const tieneEmpresa = Boolean(alumno?.empresa);

  const puedeUsarProduccion = esSexto && tieneEmpresa;

  const {
    data,
    isLoading: cargandoProduccion,
    isError: errorProduccion,
    refetch: refetchProduccion,
  } = useProduccion(puedeUsarProduccion);

  const {
    data: planificacion,
    isLoading: cargandoPlanificacion,
    isError: errorPlanificacion,
    refetch: refetchPlanificacion,
  } = usePlanificacionAnual(puedeUsarProduccion);

  const iniciarOrden = useIniciarOrdenProduccion();

  const finalizarOrden = useFinalizarOrdenProduccion();

  const {
    data: detalleOrden,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
  } = useDetalleOrdenProduccion(idOrdenSeleccionada);

  const handleVerDetalle = (idOrden: number) => {
    setIdOrdenSeleccionada(idOrden);
  };

  const handleCerrarDetalle = () => {
    setIdOrdenSeleccionada(null);
  };

  const handleIniciar = (idOrden: number) => {
    iniciarOrden.mutate(idOrden);
  };

  const handleFinalizar = (idOrden: number) => {
    finalizarOrden.mutate(idOrden);
  };

  if (cargandoAlumno) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando producción...</p>
      </div>
    );
  }

  if (errorAlumno || !alumno) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          No fue posible comprobar la información del alumno
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un problema al consultar tu curso y tus datos actuales.
        </p>

        <button
          type="button"
          onClick={() => refetchAlumno()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  /*
   * Primero evaluamos el curso.
   *
   * Esto es importante porque un alumno de 5.º sin empresa
   * no debe recibir el mensaje "Todavía no pertenecés a una empresa".
   */
  if (!esSexto) {
    return (
      <EstadoProduccionNoDisponible
        icono={<GraduationCap className="h-9 w-9 text-abacontex-primary" />}
        titulo="Producción no está disponible para tu curso"
        descripcion="El módulo de Producción está disponible únicamente para alumnos de 6.º año."
        descripcionSecundaria="Las empresas de 5.º año no necesitan gestionar órdenes de producción ni planificación anual."
      />
    );
  }

  /*
   * Llegados a este punto sabemos que el alumno es de 6.º.
   * Ahora sí evaluamos si pertenece a una empresa.
   */
  if (!tieneEmpresa) {
    return (
      <EstadoProduccionNoDisponible
        icono={<Factory className="h-9 w-9 text-abacontex-primary" />}
        titulo="Todavía no pertenecés a una empresa"
        descripcion="Para acceder al módulo de Producción primero tenés que formar parte de una empresa de tu curso."
        descripcionSecundaria="Cuando seas incorporado a una empresa, vas a poder acceder automáticamente a las funcionalidades de producción."
      />
    );
  }

  if (cargandoProduccion) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando producción...</p>
      </div>
    );
  }

  if (errorProduccion || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar producción</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar las órdenes de producción.
        </p>

        <button
          type="button"
          onClick={() => refetchProduccion()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
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

          <span className="font-medium text-gray-700">Producción</span>
        </nav>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Producción</h1>

            <p className="mt-1 text-sm text-gray-500">
              Gestioná las órdenes de fabricación de tu empresa y controlá el avance de fabricación.
            </p>
          </div>

          <Button
            type="button"
            variant="solid"
            label="Crear orden"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate('/alumno/produccion/crear')}
            className="!px-4 !py-2.5"
          />
        </header>

        {cargandoPlanificacion && (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex min-h-[180px] items-center justify-center">
              <p className="text-sm text-gray-500">Cargando planificación de producción...</p>
            </div>
          </section>
        )}

        {errorPlanificacion && !cargandoPlanificacion && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-800">
              No fue posible cargar la planificación anual.
            </p>

            <p className="mt-1 text-sm text-red-700">
              Las órdenes de producción pueden seguir utilizándose normalmente.
            </p>

            <button
              type="button"
              onClick={() => refetchPlanificacion()}
              className="mt-3 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Reintentar
            </button>
          </section>
        )}

        {planificacion && !cargandoPlanificacion && !errorPlanificacion && (
          <PlanProduccionAnual planificacion={planificacion} />
        )}

        <ResumenOrdenesProduccion resumen={data.resumen} />

        <TableroProduccion
          columnas={data.columnas}
          onVerDetalle={handleVerDetalle}
          onIniciar={handleIniciar}
          onFinalizar={handleFinalizar}
        />
      </div>

      <DetalleOrdenProduccionModal
        abierto={idOrdenSeleccionada !== null}
        orden={detalleOrden}
        cargando={cargandoDetalle}
        error={errorDetalle}
        onCerrar={handleCerrarDetalle}
        onIniciar={handleIniciar}
        onFinalizar={handleFinalizar}
        actualizando={iniciarOrden.isPending || finalizarOrden.isPending}
      />
    </>
  );
}

interface EstadoProduccionNoDisponibleProps {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
  descripcionSecundaria: string;
}

function EstadoProduccionNoDisponible({
  icono,
  titulo,
  descripcion,
  descripcionSecundaria,
}: EstadoProduccionNoDisponibleProps) {
  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Producción</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Producción</h1>

        <p className="mt-1 text-sm text-gray-500">
          Gestioná las órdenes de fabricación de tu empresa y controlá el avance de fabricación.
        </p>
      </header>

      <div className="flex justify-center pt-6">
        <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
            {icono}
          </div>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            {titulo}
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            {descripcion}
          </p>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            {descripcionSecundaria}
          </p>
        </section>
      </div>
    </div>
  );
}
