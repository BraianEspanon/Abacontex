import { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Crown,
  GraduationCap,
  Home,
  PencilLine,
  Users,
} from 'lucide-react';

import Button from '../../components/ui/Button';

import { useCorreccionesResumen } from '../../hooks/useCorreccionesResumen';
import { useCursosDocente } from '../../hooks/useCursosDocente';
import { useDashboardDocente } from '../../hooks/useDashboardDocente';
import { useDocenteActual } from '../../hooks/useDocenteActual';

interface TarjetaResumenProps {
  titulo: string;
  valor: string | number;
  subtitulo: string;
  icono: React.ReactNode;
  destacado?: boolean;
}

function TarjetaResumen({
  titulo,
  valor,
  subtitulo,
  icono,
  destacado = false,
}: TarjetaResumenProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef1eb] text-abacontex-primary">
          {icono}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-700">{titulo}</p>

          <p
            className={`mt-1 text-xl font-semibold ${
              destacado ? 'text-red-600' : 'text-abacontex-primary'
            }`}
          >
            {valor}
          </p>

          <p className="mt-1 text-xs text-gray-500">{subtitulo}</p>
        </div>
      </div>
    </article>
  );
}

interface PanelSinDatosProps {
  titulo: string;
  descripcion: string;
  className?: string;
}

function PanelSinDatos({ titulo, descripcion, className = '' }: PanelSinDatosProps) {
  return (
    <section className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="text-sm font-semibold text-gray-900">{titulo}</h2>

      <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <AlertTriangle size={19} className="text-gray-400" />
        </div>

        <p className="text-sm font-medium text-gray-600">Información no disponible</p>

        <p className="mt-1 max-w-sm text-xs leading-relaxed text-gray-400">{descripcion}</p>
      </div>
    </section>
  );
}

export default function InicioDocente() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string>('TODOS');

  const { data: dashboard, isLoading, isError, refetch } = useDashboardDocente();

  const { data: docente } = useDocenteActual();

  const { data: cursos = [], isLoading: cargandoCursos, isError: errorCursos } = useCursosDocente();

  const cursoId = cursoSeleccionado === 'TODOS' ? undefined : Number(cursoSeleccionado);

  const cursoActual = cursos.find((curso) => curso.id === cursoId);

  const {
    data: correcciones,
    isLoading: cargandoCorrecciones,
    isError: errorCorrecciones,
  } = useCorreccionesResumen(cursoId);

  if (isLoading) {
    return (
      <div className="w-full max-w-[1600px]">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-24 rounded bg-gray-200" />

          <div className="h-32 rounded-2xl bg-gray-200" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-gray-200" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="h-72 rounded-2xl bg-gray-200 xl:col-span-2" />
            <div className="h-72 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="w-full max-w-[1600px]">
        <section className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">
            No pudimos cargar el panel docente
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Ocurrió un problema al obtener la información del dashboard.
          </p>

          <div className="mt-5 flex justify-center">
            <Button type="button" label="Reintentar" onClick={() => void refetch()} />
          </div>
        </section>
      </div>
    );
  }

  const { resumen } = dashboard;

  const nombreDocente = docente?.nombre?.trim() || 'Docente';

  /*
   * Si hay un curso seleccionado utilizamos los datos reales
   * correspondientes a ese curso.
   *
   * Si estamos viendo todos los cursos utilizamos el resumen
   * general del dashboard.
   */
  const cursosActivos = cursoActual !== undefined ? 1 : resumen.cursosActivos;

  const empresasActivas = cursoActual?.empresasActivas ?? resumen.empresasActivas;

  const alumnos = cursoActual?.alumnos ?? resumen.alumnos;

  /*
   * Puntaje empresarial.
   */
  const puntajeValor = cursoActual?.puntajePromedioEmpresarial ?? resumen.puntajePromedio;

  const puntajePromedio =
    puntajeValor !== null
      ? puntajeValor.toLocaleString('es-AR', {
          maximumFractionDigits: 1,
        })
      : '—';

  /*
   * Correcciones reales.
   *
   * Un ejercicio requiere atención si está pendiente
   * o actualmente en corrección.
   */
  const ejerciciosPorCorregir = correcciones
    ? correcciones.resumen.pendientes + correcciones.resumen.enCorreccion
    : resumen.ejerciciosPendientes;

  const ejerciciosPendientes =
    correcciones?.items
      .filter((ejercicio) => ejercicio.entregasPendientes > 0 || ejercicio.entregasEnCorreccion > 0)
      .slice(0, 3) ?? [];

  return (
    <div className="w-full max-w-[1600px] space-y-4">
      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Home className="h-4 w-4" />

        <span className="font-medium text-gray-700">Panel docente</span>
      </nav>

      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1D271F]">
              ¡Hola, <span className="italic text-abacontex-primary">{nombreDocente}!</span>
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">Bienvenido/a a tu panel docente</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
              Año
              <select
                disabled
                className="min-w-40 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none disabled:cursor-not-allowed"
              >
                <option>Año lectivo actual</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
              Curso
              <select
                value={cursoSeleccionado}
                onChange={(event) => setCursoSeleccionado(event.target.value)}
                disabled={cargandoCursos || errorCursos}
                className="min-w-48 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary-three/30 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="TODOS">
                  {cargandoCursos
                    ? 'Cargando cursos...'
                    : errorCursos
                      ? 'No se pudieron cargar'
                      : 'Todos mis cursos'}
                </option>

                {!cargandoCursos &&
                  !errorCursos &&
                  cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* =====================================================
          TARJETAS PRINCIPALES
      ====================================================== */}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <TarjetaResumen
          titulo="Cursos activos"
          valor={cursosActivos}
          subtitulo={cursoActual ? cursoActual.nombre : 'Cursos asignados'}
          icono={<GraduationCap size={21} />}
        />

        <TarjetaResumen
          titulo="Empresas activas"
          valor={empresasActivas}
          subtitulo="Empresas supervisadas"
          icono={<Building2 size={21} />}
        />

        <TarjetaResumen
          titulo="Alumnos"
          valor={alumnos}
          subtitulo="Alumnos asignados"
          icono={<Users size={21} />}
        />

        <TarjetaResumen
          titulo="Ejercicios por corregir"
          valor={cargandoCorrecciones ? '...' : errorCorrecciones ? '—' : ejerciciosPorCorregir}
          subtitulo="Pendientes de revisión"
          icono={<PencilLine size={21} />}
          destacado={ejerciciosPorCorregir > 0}
        />

        <TarjetaResumen
          titulo="Puntaje promedio empresarial"
          valor={puntajePromedio}
          subtitulo={puntajeValor === null ? 'Aún no disponible' : 'Promedio general'}
          icono={<Crown size={21} />}
        />
      </section>

      {/* =====================================================
          FILA PRINCIPAL
      ====================================================== */}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelSinDatos
          titulo="Evolución del puntaje empresarial promedio"
          descripcion="Todavía no existe información histórica suficiente para representar la evolución del puntaje."
          className="xl:col-span-2"
        />

        <PanelSinDatos
          titulo="Alumnos en riesgo"
          descripcion="El análisis individual de riesgo todavía no se encuentra disponible para el panel."
        />
      </section>

      {/* =====================================================
          FILA INFERIOR
      ====================================================== */}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <PanelSinDatos
          titulo="Ranking empresarial"
          descripcion="El ranking empresarial todavía no se encuentra disponible mediante las APIs del panel docente."
        />

        {cursoActual?.participacionPromedio !== null &&
        cursoActual?.participacionPromedio !== undefined ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Participación y desempeño por curso
            </h2>

            <div className="flex min-h-40 flex-col items-center justify-center">
              <p className="text-4xl font-semibold text-abacontex-primary">
                {cursoActual.participacionPromedio.toLocaleString('es-AR', {
                  maximumFractionDigits: 1,
                })}
                %
              </p>

              <p className="mt-2 text-sm text-gray-500">Participación promedio</p>

              <p className="mt-1 text-xs text-gray-400">{cursoActual.nombre}</p>
            </div>
          </section>
        ) : (
          <PanelSinDatos
            titulo="Participación y desempeño por curso"
            descripcion={
              cursoActual
                ? 'Todavía no hay una participación promedio calculada para este curso.'
                : 'Seleccioná un curso para consultar su participación cuando esta métrica se encuentre disponible.'
            }
          />
        )}

        <div className="grid gap-4">
          {/* ===============================================
              CORRECCIONES
          ================================================ */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Correcciones pendientes</h2>

              {!cargandoCorrecciones && !errorCorrecciones && correcciones && (
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                  {ejerciciosPorCorregir}
                </span>
              )}
            </div>

            {cargandoCorrecciones && (
              <div className="flex min-h-36 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-abacontex-primary" />

                  <p className="mt-3 text-sm text-gray-500">Cargando correcciones...</p>
                </div>
              </div>
            )}

            {errorCorrecciones && (
              <div className="flex min-h-36 items-center justify-center text-center">
                <p className="text-sm text-gray-500">
                  No se pudo obtener la información de correcciones.
                </p>
              </div>
            )}

            {!cargandoCorrecciones &&
              !errorCorrecciones &&
              correcciones &&
              ejerciciosPendientes.length === 0 && (
                <div className="flex min-h-36 flex-col items-center justify-center text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    No hay correcciones pendientes
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    No tenés ejercicios pendientes de revisión.
                  </p>
                </div>
              )}

            {!cargandoCorrecciones && !errorCorrecciones && ejerciciosPendientes.length > 0 && (
              <div className="mt-4 space-y-2">
                {ejerciciosPendientes.map((ejercicio) => {
                  const pendientes = ejercicio.entregasPendientes + ejercicio.entregasEnCorreccion;

                  return (
                    <div
                      key={ejercicio.idEjercicio}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 transition hover:bg-gray-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef1eb] text-abacontex-primary">
                        <PencilLine size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {ejercicio.titulo}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                          {ejercicio.curso.nombreCurso}
                        </p>
                      </div>

                      <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        {pendientes}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ===============================================
              ALERTAS
          ================================================ */}

          <PanelSinDatos
            titulo="Alertas del curso"
            descripcion="El sistema de alertas todavía no está disponible mediante el backend actual."
          />
        </div>
      </section>
    </div>
  );
}
