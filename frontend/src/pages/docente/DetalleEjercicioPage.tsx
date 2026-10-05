import type { ReactNode } from 'react';

import {
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Eye,
  FileText,
  House,
  Info,
  Pencil,
  Send,
  UserRound,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import MarkdownEjercicio from '../../components/ejercicios/MarkdownEjercicio';
import ProgresoEntregas from '../../components/ejercicios/ProgresoEntregas';
import { useEjercicioDetalle } from '../../hooks/useEjercicioDetalle';
import { useEditarEjercicio } from '../../hooks/useEditarEjercicio';

const LABEL_TIPO: Record<string, string> = {
  COMPRAS_VENTAS_BASICAS: 'Compras y ventas básicas',
  OPERACIONES_COMERCIALES_INTEGRADAS: 'Operaciones comerciales integradas',
  AJUSTES_HOJA_TRABAJO: 'Ajustes y Hoja de Trabajo',
  COSTOS_PROCESO_PRODUCTIVO: 'Costos y proceso productivo',
};

const LABEL_DIFICULTAD: Record<string, string> = {
  BASICO: 'Básico',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
};

const LABEL_CONTENIDO: Record<string, string> = {
  IVA: 'Incluir IVA',
  INTERESES: 'Incluir intereses',
  DESCUENTOS: 'Incluir descuentos',
};

const LABEL_PLANTILLA: Record<string, string> = {
  LIBRO_DIARIO: 'Libro diario',
  LIBRO_MAYOR: 'Libro mayor',
  LIBRO_IVA: 'IVA',
  HOJA_TRABAJO: 'Hoja de trabajo',
};

export default function DetalleEjercicioPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const idEjercicio = Number(id);

  const { data: ejercicio, isLoading, isError } = useEjercicioDetalle(idEjercicio);

  const editarEjercicio = useEditarEjercicio();

  if (isLoading) {
    return (
      <div className="min-w-0 space-y-5 animate-pulse">
        <div className="h-5 w-80 rounded bg-gray-200" />
        <div className="h-8 w-72 rounded bg-gray-200" />
        <div className="h-16 max-w-2xl rounded-xl bg-gray-200" />

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-5">
            <div className="h-40 rounded-2xl bg-gray-200" />
            <div className="h-60 rounded-2xl bg-gray-200" />
            <div className="h-36 rounded-2xl bg-gray-200" />
          </div>

          <div className="h-150 rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (isError || !ejercicio) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="font-medium text-red-600">No fue posible cargar el ejercicio.</p>
      </div>
    );
  }

  const esIA = ejercicio.origen === 'IA';

  const totalAlumnos = ejercicio.progresoEntregas.totalAlumnos;

  const entregados = totalAlumnos - ejercicio.progresoEntregas.sinEntregar;

  return (
    <div className="min-w-0 space-y-5 overflow-x-clip">
      {/* BREADCRUMB */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-abacontex-gray-text">
        <House className="size-4" />

        <ChevronRight className="size-4" />

        <Link to="/docente" className="transition hover:text-abacontex-primary">
          Inicio
        </Link>

        <ChevronRight className="size-4" />

        <Link to="/docente/ejercicios" className="transition hover:text-abacontex-primary">
          Mis ejercicios
        </Link>

        <ChevronRight className="size-4" />

        <span className="font-semibold text-abacontex-black-text">Detalle</span>
      </nav>

      {/* CABECERA */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h1 className="max-w-full text-2xl font-semibold text-abacontex-black-text">
            {ejercicio.titulo}
          </h1>

          {ejercicio.curso.nombreCurso && (
            <span className="shrink-0 rounded-lg bg-abacontex-primary-three/30 px-4 py-1 text-sm font-medium text-abacontex-primary">
              {ejercicio.curso.nombreCurso}
            </span>
          )}

          <span
            className={`shrink-0 rounded-lg px-3 py-1 text-sm font-medium ${obtenerClaseEstado(
              ejercicio.estado
            )}`}
          >
            {formatearEstado(ejercicio.estado)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {ejercicio.estado === 'BORRADOR' && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (ejercicio.origen === 'IA') {
                    navigate(`/docente/ejercicios/nuevo/ia?editar=${ejercicio.idEjercicio}`);
                  } else {
                    navigate(`/docente/ejercicios/nuevo?editar=${ejercicio.idEjercicio}`);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-abacontex-black-text shadow-sm transition hover:bg-abacontex-light"
              >
                <Pencil className="size-4" />
                Continuar edición
              </button>

              <button
                type="button"
                disabled={editarEjercicio.isPending}
                onClick={() => {
                  editarEjercicio.mutate(
                    {
                      idEjercicio: ejercicio.idEjercicio,
                      datos: {
                        estado: 'ENVIADO',
                      },
                    },
                    {
                      onSuccess: () => {
                        navigate(`/docente/ejercicios/${ejercicio.idEjercicio}`);
                      },
                    }
                  );
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-abacontex-primary-three px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-abacontex-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-4" />

                {editarEjercicio.isPending ? 'Enviando...' : 'Enviar a los alumnos'}
              </button>
            </>
          )}

          {ejercicio.estado === 'SIN_RESOLVER' && (
            <button
              type="button"
              onClick={() => {
                if (ejercicio.origen === 'IA') {
                  navigate(`/docente/ejercicios/nuevo/ia?editar=${ejercicio.idEjercicio}`);
                } else {
                  navigate(`/docente/ejercicios/nuevo?editar=${ejercicio.idEjercicio}`);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-abacontex-black-text shadow-sm transition hover:bg-abacontex-light"
            >
              <Pencil className="size-4" />
              Continuar resolución
            </button>
          )}

          {['ENVIADO', 'COMPLETADO', 'EN_CORRECCION'].includes(ejercicio.estado) && (
            <button
              type="button"
              onClick={() => navigate('/docente/correcciones')}
              className="inline-flex items-center gap-2 rounded-lg bg-abacontex-primary-three px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-abacontex-primary"
            >
              <Send className="size-4" />
              Ir a correcciones
            </button>
          )}
        </div>
      </div>

      {/* DATOS SUPERIORES */}
      <div className="grid w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-gray-100/70 md:grid-cols-3">
        <DatoResumen
          icono={<CalendarCheck className="size-6" />}
          titulo="Fecha de creación"
          valor={formatearFechaLarga(ejercicio.createdAt)}
        />

        <DatoResumen
          separador
          icono={<CalendarDays className="size-6" />}
          titulo="Fecha límite"
          valor={formatearFechaLarga(ejercicio.fechaLimite)}
        />

        <DatoResumen
          separador
          icono={<UserRound className="size-6" />}
          titulo="Total de alumnos"
          valor={String(totalAlumnos)}
        />
      </div>

      {/* CUERPO */}
      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* COLUMNA IZQUIERDA */}
        <div className="min-w-0 space-y-5">
          {/* INFORMACIÓN GENERAL */}
          <section className="min-w-0 rounded-2xl bg-white p-5 shadow-md">
            <TituloSeccion icono={<Info className="size-5" />} titulo="Información general" />

            <div className="mt-2">
              {esIA && ejercicio.generacionIA ? (
                <div className="divide-y divide-gray-200">
                  <FilaInfo
                    titulo="Tipo de ejercicio"
                    contenido={
                      LABEL_TIPO[ejercicio.generacionIA.tipoEjercicio] ??
                      ejercicio.generacionIA.tipoEjercicio
                    }
                  />

                  <FilaInfo
                    titulo="Dificultad"
                    contenido={
                      <Etiqueta>
                        {LABEL_DIFICULTAD[ejercicio.generacionIA.dificultad] ??
                          ejercicio.generacionIA.dificultad}
                      </Etiqueta>
                    }
                  />

                  <FilaInfo
                    titulo="Contenido adicional"
                    contenido={
                      ejercicio.generacionIA.contenidos.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {ejercicio.generacionIA.contenidos.map((contenido) => (
                            <Etiqueta key={contenido}>
                              {LABEL_CONTENIDO[contenido] ?? contenido}
                            </Etiqueta>
                          ))}
                        </div>
                      ) : (
                        '-'
                      )
                    }
                  />

                  <FilaInfo
                    titulo="Plantillas habilitadas"
                    contenido={
                      <div className="flex flex-wrap gap-2">
                        {ejercicio.plantillas.map((plantilla) => (
                          <Etiqueta key={plantilla.idEjercicioPlantilla}>
                            {LABEL_PLANTILLA[plantilla.tipo] ?? plantilla.tipo}
                          </Etiqueta>
                        ))}
                      </div>
                    }
                  />

                  <FilaInfo
                    titulo="Contexto adicional"
                    contenido={ejercicio.generacionIA.contextoAdicional || '-'}
                  />
                </div>
              ) : (
                <FilaInfo
                  titulo="Plantillas habilitadas"
                  contenido={
                    <div className="flex flex-wrap gap-2">
                      {ejercicio.plantillas.map((plantilla) => (
                        <Etiqueta key={plantilla.idEjercicioPlantilla}>
                          {LABEL_PLANTILLA[plantilla.tipo] ?? plantilla.tipo}
                        </Etiqueta>
                      ))}
                    </div>
                  }
                />
              )}
            </div>
          </section>

          {/* PROGRESO */}
          <section className="min-w-0 rounded-2xl bg-white p-5 shadow-md">
            <TituloSeccion icono={<Send className="size-5" />} titulo="Progreso de entregas" />

            <div className="mt-4 min-w-0">
              <ProgresoEntregas
                totalAlumnos={totalAlumnos}
                entregados={entregados}
                corregidos={ejercicio.progresoEntregas.entregasCorregidas}
                pendientesCorreccion={ejercicio.progresoEntregas.entregasPendientes}
                sinEntregar={ejercicio.progresoEntregas.sinEntregar}
              />
            </div>
          </section>

          {/* RESOLUCIÓN DOCENTE */}
          <section className="min-w-0 rounded-2xl bg-white p-5 shadow-md">
            <TituloSeccion icono={<Pencil className="size-5" />} titulo="Resolución docente" />

            {ejercicio.resolucionDocente?.estado === 'COMPLETADA' ? (
              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="rounded-lg bg-abacontex-primary-three/30 px-3 py-1 text-sm font-medium text-abacontex-primary">
                    Cargada
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-abacontex-black-text shadow-sm transition hover:bg-abacontex-light"
                  >
                    <Eye className="size-4" />
                    Ver resolución
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-abacontex-black-text shadow-sm transition hover:bg-abacontex-light"
                  >
                    <Pencil className="size-4" />
                    Editar resolución
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium text-abacontex-primary">
                  Sin cargar
                </span>

                <p className="text-sm text-abacontex-gray-text">
                  Todavía no hay una resolución cargada para este ejercicio.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ENUNCIADO */}
        <section className="min-w-0 overflow-hidden rounded-2xl bg-white p-5 shadow-md lg:sticky lg:top-5">
          <TituloSeccion icono={<FileText className="size-5" />} titulo="Enunciado" />

          <div className="mt-4 max-h-160 min-w-0 max-w-full overflow-y-auto pr-2">
            <MarkdownEjercicio contenido={ejercicio.enunciado} />
          </div>
        </section>
      </div>
    </div>
  );
}

function TituloSeccion({ icono, titulo }: { icono: ReactNode; titulo: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-abacontex-primary">
      {icono}

      <h2 className="font-semibold">{titulo}</h2>
    </div>
  );
}

function DatoResumen({
  icono,
  titulo,
  valor,
  separador = false,
}: {
  icono: ReactNode;
  titulo: string;
  valor: string;
  separador?: boolean;
}) {
  return (
    <div className="relative flex min-w-0 items-center gap-3 p-3">
      {separador && (
        <>
          {/* Separador vertical en escritorio */}
          <span className="absolute bottom-2 left-0 top-2 hidden w-px bg-gray-300 md:block" />

          {/* Separador horizontal en móvil */}
          <span className="absolute left-3 right-3 top-0 h-px bg-gray-300 md:hidden" />
        </>
      )}

      <div className="shrink-0 text-abacontex-gray-text">{icono}</div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-abacontex-black-text">{titulo}</p>

        <p className="mt-1 text-sm text-abacontex-gray-text">{valor}</p>
      </div>
    </div>
  );
}

function FilaInfo({ titulo, contenido }: { titulo: string; contenido: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-2 py-3 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
      <span className="font-medium text-abacontex-gray-text">{titulo}</span>

      <div className="min-w-0 text-abacontex-black-text">{contenido}</div>
    </div>
  );
}

function Etiqueta({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-lg bg-gray-200 px-2.5 py-1 text-sm text-abacontex-black-text">
      {children}
    </span>
  );
}

function formatearFechaLarga(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}

function formatearEstado(estado: string) {
  const estados: Record<string, string> = {
    BORRADOR: 'Borrador',
    ENVIADO: 'Enviado',
    SIN_RESOLVER: 'Sin resolver',
    EN_CORRECCION: 'En corrección',
    COMPLETADO: 'Completado',
  };

  return estados[estado] ?? estado;
}

function obtenerClaseEstado(estado: string) {
  switch (estado) {
    case 'BORRADOR':
      return 'bg-orange-100 text-orange-600';

    case 'SIN_RESOLVER':
      return 'bg-orange-100 text-orange-500';

    case 'EN_CORRECCION':
      return 'bg-fuchsia-100 text-fuchsia-600';

    case 'COMPLETADO':
      return 'bg-abacontex-primary-three text-white';

    case 'ENVIADO':
    default:
      return 'bg-green-100 text-abacontex-primary';
  }
}
