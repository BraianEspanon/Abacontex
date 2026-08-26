import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Factory,
  GraduationCap,
  Home,
  Pencil,
  Target,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import EditarEstimacionMensualModal from '../../components/produccion/EditarEstimacionMensualModal';
import Button from '../../components/ui/Button';

import { useActualizarPlanificacionMensual } from '../../hooks/useActualizarPlanificacionMensual';
import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { usePlanificacionAnual } from '../../hooks/usePlanificacionAnual';

import type {
  EstadoMesPlanificacion,
  MesPlanificacionAnual,
} from '../../types/planificacion.types';

import { esCursoSexto } from '../../utils/curso.utils';

const nombresMeses = [
  '',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const nombresEstado: Record<EstadoMesPlanificacion, string> = {
  SIN_INICIAR: 'Sin iniciar',
  EN_CURSO: 'En curso',
  COMPLETADO: 'Completado',
};

const clasesEstado: Record<EstadoMesPlanificacion, string> = {
  SIN_INICIAR: 'bg-gray-100 text-gray-600',
  EN_CURSO: 'bg-blue-50 text-blue-700',
  COMPLETADO: 'bg-green-50 text-green-700',
};

export default function PlanificacionAnualPage() {
  const navigate = useNavigate();

  const [mesSeleccionado, setMesSeleccionado] = useState<MesPlanificacionAnual | null>(null);

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const esSexto = esCursoSexto(alumno?.curso?.nombre);

  const tieneEmpresa = Boolean(alumno?.empresa);

  const puedeUsarPlanificacion = esSexto && tieneEmpresa;

  const {
    data: planificacion,
    isLoading,
    isError,
    refetch,
  } = usePlanificacionAnual(puedeUsarPlanificacion);

  const actualizarPlanificacion = useActualizarPlanificacionMensual();

  const handleEditarMes = (mes: MesPlanificacionAnual) => {
    if (mes.estado === 'COMPLETADO') {
      return;
    }

    setMesSeleccionado(mes);
  };

  const handleCerrarEdicion = () => {
    if (actualizarPlanificacion.isPending) {
      return;
    }

    setMesSeleccionado(null);
  };

  const handleGuardarEstimacion = (idDetalle: number, unidadesEstimadas: number) => {
    actualizarPlanificacion.mutate(
      {
        idDetalle,
        payload: {
          unidadesEstimadas,
        },
      },
      {
        onSuccess: () => {
          setMesSeleccionado(null);
        },
      }
    );
  };

  if (cargandoAlumno) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando estimación anual...</p>
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

  if (!esSexto) {
    return (
      <EstadoPlanificacionNoDisponible
        icono={<GraduationCap className="h-9 w-9 text-abacontex-primary" />}
        titulo="La planificación anual no está disponible para tu curso"
        descripcion="Esta funcionalidad forma parte del módulo de Producción y está disponible únicamente para alumnos de 6.º año."
      />
    );
  }

  if (!tieneEmpresa) {
    return (
      <EstadoPlanificacionNoDisponible
        icono={<Factory className="h-9 w-9 text-abacontex-primary" />}
        titulo="Todavía no pertenecés a una empresa"
        descripcion="Para acceder a la planificación anual primero tenés que formar parte de una empresa de tu curso."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando estimación anual...</p>
      </div>
    );
  }

  if (isError || !planificacion) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar la estimación anual</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar la planificación de producción.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const tienePlanificacion = planificacion.estado === 'CARGADA';

  const resumen = planificacion.resumen;

  return (
    <>
      <div className="mx-auto w-full max-w-[1180px] space-y-5">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link to="/alumno/produccion" className="transition hover:text-gray-700">
            Producción
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-semibold text-gray-800">Planificación de producción</span>
        </nav>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Definí y monitoreá la producción estimada de tu empresa durante el ciclo lectivo.
          </p>

          <Button
            type="button"
            variant="outline"
            label="Volver a producción"
            icon={<ChevronLeft className="h-4 w-4" />}
            onClick={() => navigate('/alumno/produccion')}
            className="!rounded-lg !px-4 !py-2.5"
          />
        </header>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <IndicadorCard
            titulo="Ciclo lectivo"
            valor={planificacion.cicloLectivo.toString()}
            icono={<CalendarDays className="h-5 w-5" />}
          />

          <IndicadorCard
            titulo="Estimación anual"
            valor={tienePlanificacion ? `${resumen.unidadesEstimadas} u.` : '-'}
            icono={<BarChart3 className="h-5 w-5" />}
          />

          <IndicadorCard
            titulo="Producido"
            valor={tienePlanificacion ? `${resumen.unidadesProducidas} u.` : '-'}
            icono={<CheckCircle2 className="h-5 w-5" />}
          />

          <IndicadorCard
            titulo="Cumplimiento anual"
            valor={tienePlanificacion ? `${Math.round(resumen.cumplimiento)}%` : '-'}
            icono={<Target className="h-5 w-5" />}
          />
        </section>

        {actualizarPlanificacion.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-800">
              No fue posible actualizar la estimación mensual.
            </p>

            <p className="mt-1 text-sm text-red-700">
              Revisá el valor ingresado e intentá nuevamente.
            </p>
          </div>
        )}

        {!tienePlanificacion ? (
          <>
            <section className="mx-auto w-full max-w-[980px] rounded-2xl border border-gray-200 bg-white px-7 py-6 shadow-sm">
              <div className="grid items-center gap-4 lg:grid-cols-[1.55fr_0.65fr]">
                <div>
                  <h2 className="text-center text-[25px] font-semibold leading-tight text-[#496647]">
                    ¡Aún no has cargado la planificación anual!
                  </h2>

                  <p className="mt-4 text-center text-base font-semibold text-[#496647]">
                    ¿Qué sucede al cargar tu planificación?
                  </p>

                  <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <Beneficio
                      icono={<BarChart3 className="h-6 w-6" />}
                      titulo="Unidades estimadas anuales"
                      descripcion="Verás el total de unidades que tu empresa planea producir durante el año."
                    />

                    <Beneficio
                      icono={<Target className="h-6 w-6" />}
                      titulo="Producido acumulado"
                      descripcion="Se actualizará automáticamente a medida que finalices órdenes de producción."
                    />

                    <Beneficio
                      icono={<CheckCircle2 className="h-6 w-6" />}
                      titulo="Cumplimiento anual"
                      descripcion="Reflejará el avance porcentual respecto de lo planificado."
                    />
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button
                      type="button"
                      variant="solid"
                      label="Cargar planificación anual"
                      onClick={() => navigate('/alumno/produccion/planificacion/cargar')}
                      className="!rounded-lg !px-5 !py-2.5"
                    />
                  </div>
                </div>

                <div className="hidden items-end justify-center lg:flex">
                  <img
                    src="/img/planificacion-anual-mascota.png"
                    alt="Ilustración de planificación anual"
                    className="h-auto max-h-[285px] w-auto object-contain"
                  />
                </div>
              </div>
            </section>

            <section className="overflow-hidden border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-100">
                    <tr className="text-left text-xs font-semibold text-gray-700">
                      <th className="px-5 py-3">Mes</th>

                      <th className="px-5 py-3 text-center">Producción estimada (u.)</th>

                      <th className="px-5 py-3 text-center">Producción real (u.)</th>

                      <th className="px-5 py-3 text-center">Cumplimiento</th>

                      <th className="px-5 py-3 text-center">Estado</th>

                      <th className="px-5 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {[3, 4, 5, 6].map((mes) => (
                      <tr key={mes}>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{nombresMeses[mes]}</td>

                        <td className="px-5 py-3.5">
                          <PlaceholderLinea />
                        </td>

                        <td className="px-5 py-3.5">
                          <PlaceholderLinea />
                        </td>

                        <td className="px-5 py-3.5">
                          <PlaceholderLinea />
                        </td>

                        <td className="px-5 py-3.5">
                          <PlaceholderLinea />
                        </td>

                        <td className="px-5 py-3.5">
                          <PlaceholderLinea />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-gray-100">
                  <tr className="text-left text-xs font-semibold text-gray-600">
                    <th className="px-5 py-3">Mes</th>

                    <th className="px-5 py-3 text-center">Producción estimada (u.)</th>

                    <th className="px-5 py-3 text-center">Producción real (u.)</th>

                    <th className="px-5 py-3 text-center">Cumplimiento</th>

                    <th className="px-5 py-3 text-center">Estado</th>

                    <th className="px-5 py-3 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {planificacion.meses.map((mes) => (
                    <FilaMes key={mes.id} mes={mes} onEditar={() => handleEditarMes(mes)} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <EditarEstimacionMensualModal
        abierto={mesSeleccionado !== null}
        mes={mesSeleccionado}
        cicloLectivo={planificacion.cicloLectivo}
        guardando={actualizarPlanificacion.isPending}
        onCerrar={handleCerrarEdicion}
        onGuardar={handleGuardarEstimacion}
      />
    </>
  );
}

interface EstadoPlanificacionNoDisponibleProps {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
}

function EstadoPlanificacionNoDisponible({
  icono,
  titulo,
  descripcion,
}: EstadoPlanificacionNoDisponibleProps) {
  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-5">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Planificación de producción</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Estimación anual</h1>

        <p className="mt-1 text-sm text-gray-500">
          Definí y monitoreá la producción estimada de tu empresa durante el ciclo lectivo.
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
        </section>
      </div>
    </div>
  );
}

interface IndicadorCardProps {
  titulo: string;
  valor: string;
  icono: React.ReactNode;
}

function IndicadorCard({ titulo, valor, icono }: IndicadorCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[#496647]">
          {icono}
        </div>

        <div>
          <p className="text-sm text-gray-700">{titulo}</p>

          <p className="mt-0.5 text-xl font-semibold text-[#496647]">{valor}</p>
        </div>
      </div>
    </article>
  );
}

interface BeneficioProps {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
}

function Beneficio({ icono, titulo, descripcion }: BeneficioProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0 text-[#496647]">{icono}</div>

      <div>
        <p className="text-sm font-semibold text-gray-800">{titulo}</p>

        <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-gray-500">{descripcion}</p>
      </div>
    </div>
  );
}

interface FilaMesProps {
  mes: MesPlanificacionAnual;
  onEditar: () => void;
}

function FilaMes({ mes, onEditar }: FilaMesProps) {
  const puedeEditar = mes.estado !== 'COMPLETADO';

  return (
    <tr>
      <td className="px-5 py-4 text-sm font-medium text-gray-700">{nombresMeses[mes.mes]}</td>

      <td className="px-5 py-4 text-center text-sm text-gray-700">{mes.unidadesEstimadas}</td>

      <td className="px-5 py-4 text-center text-sm text-gray-700">{mes.unidadesProducidas}</td>

      <td className="px-5 py-4 text-center text-sm text-gray-700">
        {Math.round(mes.cumplimiento)}%
      </td>

      <td className="px-5 py-4 text-center">
        <span
          className={[
            'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
            clasesEstado[mes.estado],
          ].join(' ')}
        >
          {nombresEstado[mes.estado]}
        </span>
      </td>

      <td className="px-5 py-4 text-center">
        {puedeEditar ? (
          <button
            type="button"
            onClick={onEditar}
            aria-label={`Editar ${nombresMeses[mes.mes]}`}
            title={`Editar ${nombresMeses[mes.mes]}`}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#496647]"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>
    </tr>
  );
}

function PlaceholderLinea() {
  return <div className="mx-auto h-1.5 w-20 rounded-full bg-gray-200" />;
}
