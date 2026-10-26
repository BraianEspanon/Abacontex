import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Home,
  Lightbulb,
  Send,
  Clock3,
} from 'lucide-react';

import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useFinalizarEntregaAlumno } from '../../hooks/useFinalizarEntregaAlumno';
import Button from '../../components/ui/Button';

import MarkdownEjercicio from '../../components/ejercicios/MarkdownEjercicio';

import { useDetalleEjercicioAlumno } from '../../hooks/useDetalleEjercicioAlumno';

import type { EstadoEntregaAlumno, EstadoPlantillaAlumno } from '../../types/entrega.types';

const nombresPlantilla: Record<string, string> = {
  LIBRO_DIARIO: 'Libro diario',
  LIBRO_MAYOR: 'Libro mayor',
  LIBRO_IVA: 'Libro IVA Compras y Ventas',
  HOJA_TRABAJO: 'Hoja de trabajo',
};

const textosPlantilla: Record<EstadoPlantillaAlumno, string> = {
  PENDIENTE: 'Sin comenzar',
  EN_EDICION: 'En progreso',
  COMPLETADA: 'Completada',
};

const clasesPlantilla: Record<EstadoPlantillaAlumno, string> = {
  PENDIENTE: 'text-abacontex-gray-text',
  EN_EDICION: 'text-blue-600',
  COMPLETADA: 'text-abacontex-primary',
};

const clasesEstado: Record<EstadoEntregaAlumno, string> = {
  PENDIENTE: 'bg-orange-100 text-orange-500',
  EN_PROGRESO: 'bg-blue-100 text-blue-600',
  ENTREGADO: 'bg-fuchsia-100 text-fuchsia-700',
  CORREGIDO: 'bg-green-100 text-abacontex-primary',
  VENCIDO: 'bg-red-100 text-red-600',
};

const etiquetasEstado: Record<EstadoEntregaAlumno, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  ENTREGADO: 'Entregado',
  CORREGIDO: 'Corregido',
  VENCIDO: 'Vencido',
};

export default function DetalleEjercicioAlumno() {
  const { id } = useParams();

  const idEjercicio = Number(id);

  const { data: ejercicio, isLoading, isError, refetch } = useDetalleEjercicioAlumno(idEjercicio);

  const finalizarEntrega = useFinalizarEntregaAlumno();

  const [errorEntrega, setErrorEntrega] = useState<string | null>(null);

  const handleEntregarEjercicio = async () => {
    if (!puedeEntregar) {
      return;
    }

    setErrorEntrega(null);

    try {
      await finalizarEntrega.mutateAsync(idEjercicio);

      await refetch();
    } catch {
      setErrorEntrega('No fue posible entregar el ejercicio. Intentá nuevamente.');
    }
  };
  if (isLoading) {
    return <p className="text-sm text-abacontex-gray-text">Cargando ejercicio...</p>;
  }

  if (isError || !ejercicio) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">No fue posible cargar el ejercicio.</p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-2 text-sm font-semibold text-red-700 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const nombreDocente = `${ejercicio.docente.nombre} ${ejercicio.docente.apellido}`.trim();

  const porcentaje =
    ejercicio.totalPlantillas > 0
      ? Math.round((ejercicio.plantillasCompletadas / ejercicio.totalPlantillas) * 100)
      : 0;

  const puedeEntregar =
    ejercicio.totalPlantillas > 0 &&
    ejercicio.plantillasCompletadas === ejercicio.totalPlantillas &&
    !ejercicio.bloqueado;

  const puedeResolver = !ejercicio.bloqueado;

  return (
    <div className="space-y-5 font-sans text-abacontex-black-text">
      <nav className="flex items-center gap-2 text-sm text-abacontex-gray-text">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-abacontex-dark">
          <Home className="size-4" />
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <Link to="/alumno/ejercicios" className="transition hover:text-abacontex-dark">
          Mis ejercicios
        </Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-dark">Detalle</span>
      </nav>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-abacontex-dark">{ejercicio.titulo}</h1>

          <span
            className={`rounded-lg px-2.5 py-1 text-sm font-medium ${
              clasesEstado[ejercicio.estado]
            }`}
          >
            {etiquetasEstado[ejercicio.estado]}
          </span>
        </div>

        <Link
          to="/alumno/ejercicios"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-abacontex-dark transition hover:bg-abacontex-light"
        >
          <ArrowLeft className="size-4" />
          Volver a mis ejercicios
        </Link>
      </div>

      <section className="grid gap-4 rounded-xl border border-gray-200 bg-gray-100/60 px-4 py-3 md:grid-cols-3">
        <DatoResumen
          icono={<CalendarDays className="size-6" />}
          titulo="Fecha límite"
          valor={formatearFecha(ejercicio.fechaLimite)}
        />

        <DatoResumen
          icono={<GraduationCap className="size-6" />}
          titulo="Profesor/a"
          valor={nombreDocente}
          separador
        />

        <DatoResumen
          icono={<FileText className="size-6" />}
          titulo="Plantillas"
          valor={String(ejercicio.totalPlantillas)}
          separador
        />
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
            <FileText className="size-5 text-abacontex-primary" />

            <h2 className="text-base font-semibold text-abacontex-dark">Enunciado</h2>
          </div>

          <div className="max-h-135 overflow-y-auto px-6 py-5">
            <MarkdownEjercicio contenido={ejercicio.enunciado} />
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
              <FileText className="size-5 text-abacontex-primary" />

              <h2 className="text-base font-semibold text-abacontex-dark">
                Plantillas para resolver
              </h2>
            </div>

            <div className="space-y-3 px-6 py-4">
              {ejercicio.plantillas.map((plantilla) => (
                <div
                  key={plantilla.idEjercicioPlantilla}
                  className="flex items-center justify-between rounded-lg bg-abacontex-light px-4 py-2"
                >
                  <span className="text-sm font-medium text-abacontex-dark">
                    {nombresPlantilla[plantilla.tipo] ?? plantilla.tipo}
                  </span>

                  <span className={`text-sm font-medium ${clasesPlantilla[plantilla.estado]}`}>
                    {textosPlantilla[plantilla.estado]}
                  </span>
                </div>
              ))}

              <div className="pt-2">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-abacontex-primary-three transition-all"
                    style={{
                      width: `${porcentaje}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-abacontex-gray-text">
                  {ejercicio.plantillasCompletadas} de {ejercicio.totalPlantillas} plantillas
                  completadas
                </p>
              </div>
            </div>
          </section>

          {ejercicio.bloqueado ? (
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
                <Clock3 className="size-5 text-abacontex-primary" />

                <h2 className="text-base font-semibold text-abacontex-dark">
                  Corrección del docente
                </h2>
              </div>

              <div className="px-6 py-5">
                <p className="text-sm leading-relaxed text-abacontex-gray-text">
                  {ejercicio.correccion?.estado === 'EN_REVISION'
                    ? 'Tu docente está revisando tu entrega. Te avisaremos cuando la corrección esté disponible.'
                    : ejercicio.correccion?.estado === 'CORREGIDO'
                      ? 'Tu docente ya corrigió tu ejercicio. Podés consultar la corrección completa.'
                      : 'Tu ejercicio fue entregado correctamente. Todavía está pendiente de corrección.'}
                </p>

                {ejercicio.fechaEntrega && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-abacontex-gray-text">
                    <CheckCircle2 className="size-4 text-abacontex-primary-three" />

                    <span>Entregado el {formatearFechaHora(ejercicio.fechaEntrega)}</span>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Link
                    to={`/alumno/ejercicios/${ejercicio.idEjercicio}/resolucion`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-abacontex-dark transition hover:bg-abacontex-light"
                  >
                    Ver resolución
                    <ArrowRight className="size-4" />
                  </Link>

                  {ejercicio.correccion?.estado === 'CORREGIDO' && (
                    <Link
                      to={`/alumno/ejercicios/${ejercicio.idEjercicio}/correccion`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-abacontex-primary-three px-4 text-sm font-semibold text-white transition hover:bg-abacontex-primary"
                    >
                      Ver corrección
                      <ArrowRight className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
                <Lightbulb className="size-5 text-abacontex-primary" />

                <h2 className="text-base font-semibold text-abacontex-dark">Antes de entregar</h2>
              </div>

              <div className="px-6 py-5">
                <p className="text-sm leading-relaxed text-abacontex-gray-text">
                  Tenés que completar todas las plantillas habilitadas. Podés guardar tu trabajo y
                  continuar cuando quieras.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  {puedeResolver && (
                    <Link
                      to={`/alumno/ejercicios/${ejercicio.idEjercicio}/resolucion`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-abacontex-dark transition hover:bg-abacontex-light"
                    >
                      {ejercicio.estado === 'EN_PROGRESO'
                        ? 'Continuar resolución'
                        : 'Comenzar a resolver'}

                      <ArrowRight className="size-4" />
                    </Link>
                  )}

                  <Button
                    type="button"
                    variant="solid"
                    label={finalizarEntrega.isPending ? 'Entregando...' : 'Entregar ejercicio'}
                    icon={<Send size={16} />}
                    disabled={!puedeEntregar || finalizarEntrega.isPending}
                    onClick={() => void handleEntregarEjercicio()}
                    className="h-10! rounded-lg! px-4! py-0! text-sm! font-semibold!"
                  />

                  {errorEntrega && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-700">{errorEntrega}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

interface DatoResumenProps {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
  separador?: boolean;
}

function DatoResumen({ icono, titulo, valor, separador = false }: DatoResumenProps) {
  return (
    <div className="relative flex items-center gap-3 px-3">
      {separador && (
        <span className="absolute bottom-1 left-0 top-1 hidden w-px bg-gray-300 md:block" />
      )}

      <div className="text-abacontex-gray-text">{icono}</div>

      <div>
        <p className="text-sm font-medium text-abacontex-dark">{titulo}</p>

        <p className="mt-1 text-sm text-abacontex-gray-text">{valor}</p>
      </div>
    </div>
  );
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}

function formatearFechaHora(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
}
