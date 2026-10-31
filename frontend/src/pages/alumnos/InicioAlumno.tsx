import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Home,
  Sparkles,
  Trophy,
  UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Button from '../../components/ui/Button';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useEjerciciosAlumno } from '../../hooks/useEjerciciosAlumno';
import { useEmpresaDashboard } from '../../hooks/useEmpresaDashboard';

interface TareaInicio {
  id: string;
  titulo: string;
  modulo: string;
  cantidad: number;
  ruta: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
}

function obtenerClasePrioridad(prioridad: TareaInicio['prioridad']) {
  switch (prioridad) {
    case 'Alta':
      return 'bg-red-50 text-red-700';

    case 'Media':
      return 'bg-amber-50 text-amber-700';

    default:
      return 'bg-green-50 text-green-700';
  }
}

function TarjetaResumen({
  titulo,
  valor,
  subtitulo,
  icono,
  ruta,
}: {
  titulo: string;
  valor: string | number;
  subtitulo: string;
  icono: React.ReactNode;
  ruta?: string;
}) {
  const navigate = useNavigate();

  const contenido = (
    <div
      className={`h-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition ${
        ruta ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf1eb] text-[#527052]">
          {icono}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">{titulo}</p>

          <p className="mt-1 text-2xl font-semibold text-[#223024]">{valor}</p>

          <p className="mt-1 text-xs text-gray-500">{subtitulo}</p>
        </div>
      </div>
    </div>
  );

  if (!ruta) {
    return contenido;
  }

  return (
    <button type="button" onClick={() => navigate(ruta)} className="block h-full w-full text-left">
      {contenido}
    </button>
  );
}

function PanelNoDisponible({
  titulo,
  descripcion,
  icono,
}: {
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>

      <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          {icono}
        </div>

        <p className="text-sm font-medium text-gray-600">Información no disponible todavía</p>

        <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">{descripcion}</p>
      </div>
    </section>
  );
}

export default function InicioAlumno() {
  const navigate = useNavigate();

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  const {
    data: dashboard,
    isLoading: cargandoDashboard,
    isError: errorDashboard,
    refetch: refetchDashboard,
  } = useEmpresaDashboard(tieneEmpresa);

  const { data: ejerciciosAlumno } = useEjerciciosAlumno({
    page: 1,
    pageSize: 1,
    estado: 'TODAS',
  });

  if (cargandoAlumno) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#527052]" />

          <p className="mt-3 text-sm text-gray-500">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (errorAlumno || !alumno) {
    return (
      <div className="w-full max-w-[1600px]">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">No se pudo cargar el inicio</h2>

          <p className="mt-1 text-sm text-red-700">
            Ocurrió un problema al obtener la información del alumno.
          </p>

          <div className="mt-4">
            <Button type="button" label="Reintentar" onClick={() => void refetchAlumno()} />
          </div>
        </div>
      </div>
    );
  }

  const actividad = dashboard?.actividadPendiente;
  const indicadores = dashboard?.indicadoresNegocio;

  const ejerciciosPendientes = ejerciciosAlumno?.resumen.pendientes ?? 0;

  const tareasEmpresa = actividad
    ? actividad.pedidosPendientes +
      actividad.pedidosListosParaEntregar +
      actividad.facturasPendientes +
      actividad.asientosContablesPendientes +
      actividad.ordenesProduccionPendientes
    : 0;

  const tareas: TareaInicio[] = [];

  if (actividad) {
    if (actividad.facturasPendientes > 0) {
      tareas.push({
        id: 'facturas',
        titulo: 'Completar facturas pendientes',
        modulo: 'Facturación',
        cantidad: actividad.facturasPendientes,
        ruta: '/alumno/facturacion',
        prioridad: 'Alta',
      });
    }

    if (actividad.pedidosListosParaEntregar > 0) {
      tareas.push({
        id: 'pedidos-listos',
        titulo: 'Revisar pedidos listos para entregar',
        modulo: 'Pedidos',
        cantidad: actividad.pedidosListosParaEntregar,
        ruta: '/alumno/pedidos',
        prioridad: 'Alta',
      });
    }

    if (actividad.pedidosPendientes > 0) {
      tareas.push({
        id: 'pedidos',
        titulo: 'Gestionar pedidos pendientes',
        modulo: 'Pedidos',
        cantidad: actividad.pedidosPendientes,
        ruta: '/alumno/pedidos',
        prioridad: 'Media',
      });
    }

    if (actividad.asientosContablesPendientes > 0) {
      tareas.push({
        id: 'asientos',
        titulo: 'Registrar operaciones contables pendientes',
        modulo: 'Contabilidad',
        cantidad: actividad.asientosContablesPendientes,
        ruta: '/alumno/contabilidad',
        prioridad: 'Media',
      });
    }

    if (actividad.ordenesProduccionPendientes > 0) {
      tareas.push({
        id: 'produccion',
        titulo: 'Revisar órdenes de producción pendientes',
        modulo: 'Producción',
        cantidad: actividad.ordenesProduccionPendientes,
        ruta: '/alumno/produccion',
        prioridad: 'Media',
      });
    }
  }

  if (ejerciciosPendientes > 0) {
    tareas.push({
      id: 'ejercicios',
      titulo: 'Resolver ejercicios pendientes',
      modulo: 'Mis ejercicios',
      cantidad: ejerciciosPendientes,
      ruta: '/alumno/ejercicios',
      prioridad: 'Baja',
    });
  }

  const posicionRanking =
    dashboard?.desempeno?.posicionRanking ?? dashboard?.ranking?.posicionActual ?? null;

  const totalEmpresas =
    dashboard?.desempeno?.totalEmpresas ?? dashboard?.ranking?.totalEmpresas ?? null;

  const puntajeEmpresarial =
    dashboard?.desempeno?.puntajeTotal ?? dashboard?.empresa.puntajeEmpresarial ?? null;

  const rentabilidad = indicadores?.rentabilidadPorcentaje ?? null;

  const alertas: number | null = null;

  const datosGrafico = dashboard?.graficoEvolucion.ultimoMes ?? [];

  const ultimoLogro = dashboard?.logros?.logrosDesbloqueados?.length
    ? dashboard.logros.logrosDesbloqueados[dashboard.logros.logrosDesbloqueados.length - 1]
    : null;

  return (
    <div className="w-full max-w-[1600px] space-y-4">
      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Home className="h-4 w-4" />

        <span className="font-medium text-gray-700">Inicio</span>
      </nav>

      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1D271F]">
              ¡Qué bueno verte, <span className="text-[#527052]">{alumno.nombre}!</span>
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              Este es el resumen de tu actividad y tu empresa hoy.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <GraduationCap size={17} className="text-gray-500" />

                <div>
                  <p className="text-[10px] uppercase text-gray-400">Curso</p>

                  <p className="text-xs font-semibold text-gray-700">
                    {alumno.curso?.nombre ?? 'Sin curso'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Building2 size={17} className="text-gray-500" />

                <div>
                  <p className="text-[10px] uppercase text-gray-400">Empresa</p>

                  <p className="text-xs font-semibold text-gray-700">
                    {alumno.empresa?.nombre ?? 'Sin empresa'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <UserRound size={17} className="text-gray-500" />

                <div>
                  <p className="text-[10px] uppercase text-gray-400">Rol</p>

                  <p className="text-xs font-semibold text-gray-700">
                    {alumno.rolEmpresa?.nombre ?? 'Sin rol'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {tieneEmpresa && (
            <Button
              type="button"
              label="Ir a mi empresa"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => navigate('/alumno/empresa')}
              className="shrink-0"
            />
          )}
        </div>
      </section>

      {/* =====================================================
          ALUMNO SIN EMPRESA
      ====================================================== */}

      {!tieneEmpresa && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-3">
            <Building2 className="mt-0.5 text-amber-600" size={21} />

            <div>
              <h2 className="font-semibold text-amber-900">Todavía no pertenecés a una empresa</h2>

              <p className="mt-1 text-sm text-amber-700">
                Cuando formes parte de una empresa vas a poder consultar desde este inicio sus
                tareas, indicadores y actividad.
              </p>
            </div>
          </div>
        </section>
      )}

      {tieneEmpresa && cargandoDashboard && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-[#527052]" />

          <p className="mt-3 text-sm text-gray-500">Cargando información de la empresa...</p>
        </div>
      )}

      {tieneEmpresa && errorDashboard && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-800">
            No se pudo cargar el resumen de la empresa.
          </p>

          <div className="mt-4">
            <Button type="button" label="Reintentar" onClick={() => void refetchDashboard()} />
          </div>
        </div>
      )}

      {tieneEmpresa && dashboard && (
        <>
          {/* =================================================
              TARJETAS SUPERIORES
          ================================================= */}

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaResumen
              titulo="Ejercicios pendientes"
              valor={ejerciciosPendientes}
              subtitulo={
                ejerciciosPendientes === 0
                  ? 'Sin ejercicios pendientes'
                  : ejerciciosPendientes === 1
                    ? 'Ejercicio sin resolver'
                    : 'Ejercicios sin resolver'
              }
              icono={<BookOpenCheck size={19} />}
              ruta="/alumno/ejercicios"
            />

            <TarjetaResumen
              titulo="Simulación"
              valor="—"
              subtitulo="Próximamente"
              icono={<Sparkles size={19} />}
            />

            <TarjetaResumen
              titulo="Tareas de la empresa"
              valor={tareasEmpresa}
              subtitulo={
                tareasEmpresa === 0
                  ? 'Sin actividades pendientes'
                  : tareasEmpresa === 1
                    ? 'Actividad pendiente'
                    : 'Actividades pendientes'
              }
              icono={<ClipboardList size={19} />}
            />

            <TarjetaResumen
              titulo="Último logro"
              valor={ultimoLogro?.nombre ?? '—'}
              subtitulo={ultimoLogro ? 'Último logro desbloqueado' : 'Todavía no disponible'}
              icono={<Trophy size={19} />}
            />
          </section>

          {/* =================================================
              TAREAS + PROGRESO
          ================================================= */}

          <section className="grid items-stretch gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Tareas a realizar</h2>

              {tareas.length === 0 ? (
                <div className="flex min-h-44 flex-col items-center justify-center text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <CheckCircle2 size={22} />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No tenés tareas pendientes
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Las nuevas actividades aparecerán en esta sección.
                  </p>
                </div>
              ) : (
                <div className="mt-3 divide-y divide-gray-100">
                  {tareas.slice(0, 5).map((tarea) => (
                    <div
                      key={tarea.id}
                      className="flex min-h-[58px] flex-col gap-3 py-2.5 sm:flex-row sm:items-center"
                    >
                      <span
                        className={`w-fit rounded-full px-2 py-1 text-[10px] font-semibold ${obtenerClasePrioridad(
                          tarea.prioridad
                        )}`}
                      >
                        {tarea.prioridad}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
                            {tarea.modulo}
                          </span>

                          {tarea.cantidad > 1 && (
                            <span className="text-xs font-medium text-gray-400">
                              {tarea.cantidad} pendientes
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-700">{tarea.titulo}</p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        label={`Ir a ${tarea.modulo}`}
                        icon={<ArrowRight className="h-3.5 w-3.5" />}
                        onClick={() => navigate(tarea.ruta)}
                        className="shrink-0 !rounded-md !px-3 !py-1.5 !text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <PanelNoDisponible
              titulo="Mi progreso"
              descripcion="El progreso académico se mostrará cuando estén disponibles las métricas de desempeño del alumno."
              icono={<BarChart3 size={22} />}
            />
          </section>

          {/* =================================================
              MI EMPRESA HOY + LOGROS
          ================================================= */}

          <section className="grid items-stretch gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-gray-900">Mi empresa hoy</h2>

                <button
                  type="button"
                  onClick={() => navigate('/alumno/empresa')}
                  className="flex shrink-0 cursor-pointer items-center gap-1 text-xs font-medium text-[#527052] transition hover:opacity-70"
                >
                  Ver empresa
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    Posición
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {posicionRanking !== null ? `${posicionRanking}°` : '—'}
                  </p>

                  <p className="text-[10px] text-gray-400">
                    {posicionRanking !== null && totalEmpresas !== null
                      ? `de ${totalEmpresas}`
                      : 'Ranking no disponible'}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    Puntaje empresarial
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {puntajeEmpresarial !== null
                      ? puntajeEmpresarial.toLocaleString('es-AR', {
                          maximumFractionDigits: 1,
                        })
                      : '—'}
                  </p>

                  <p className="text-[10px] text-gray-400">
                    {puntajeEmpresarial !== null ? 'Puntaje actual' : 'No disponible'}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    Rentabilidad
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {rentabilidad !== null
                      ? `${rentabilidad.toLocaleString('es-AR', {
                          maximumFractionDigits: 1,
                        })}%`
                      : '—'}
                  </p>

                  <p className="text-[10px] text-gray-400">Resultado actual</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    Alertas
                  </p>

                  <div className="mt-1 flex items-center gap-1">
                    <AlertTriangle
                      size={15}
                      className={
                        alertas === null
                          ? 'text-gray-400'
                          : alertas > 0
                            ? 'text-red-500'
                            : 'text-green-600'
                      }
                    />

                    <p className="text-lg font-semibold text-gray-900">{alertas ?? '—'}</p>
                  </div>

                  <p className="text-[10px] text-gray-400">
                    {alertas === null
                      ? 'No disponible'
                      : alertas === 0
                        ? 'Sin alertas'
                        : 'Requieren atención'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {datosGrafico.length > 0 ? (
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={datosGrafico}
                        margin={{
                          top: 5,
                          right: 8,
                          left: -25,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                        <XAxis
                          dataKey="periodo"
                          tick={{ fontSize: 9 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />

                        <Tooltip />

                        <Line
                          type="monotone"
                          dataKey="resultado"
                          name="Resultado"
                          stroke="#527052"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-28 items-center justify-center rounded-lg bg-gray-50">
                    <div className="text-center">
                      <BarChart3 size={20} className="mx-auto text-gray-300" />

                      <p className="mt-2 text-xs text-gray-400">
                        Todavía no hay datos suficientes para mostrar la evolución.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {dashboard.logros ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900">Logros recientes</h2>

                {dashboard.logros.logrosDesbloqueados.length === 0 ? (
                  <div className="flex min-h-40 flex-col items-center justify-center text-center">
                    <Trophy size={24} className="text-gray-300" />

                    <p className="mt-3 text-sm font-medium text-gray-600">
                      Todavía no desbloqueaste logros
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {dashboard.logros.logrosDesbloqueados.slice(-3).map((logro) => (
                      <div
                        key={logro.id}
                        className="rounded-xl border border-gray-200 p-3 text-center"
                      >
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#edf1eb] text-[#527052]">
                          <Trophy size={19} />
                        </div>

                        <p className="mt-2 text-xs font-semibold text-gray-800">{logro.nombre}</p>

                        <p className="mt-1 text-[10px] leading-4 text-gray-400">
                          {logro.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <PanelNoDisponible
                titulo="Logros recientes"
                descripcion="Los logros y próximos objetivos aparecerán cuando el módulo de gamificación esté disponible."
                icono={<Trophy size={22} />}
              />
            )}
          </section>

          {/* =================================================
              ACTIVIDAD RECIENTE
          ================================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Actividad reciente</h2>

            <div className="flex min-h-28 flex-col items-center justify-center text-center">
              <ClipboardList size={22} className="text-gray-300" />

              <p className="mt-3 text-sm font-medium text-gray-600">
                Información no disponible todavía
              </p>

              <p className="mt-1 text-xs text-gray-400">
                La actividad reciente se mostrará cuando exista una fuente consolidada para el
                inicio del alumno.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
