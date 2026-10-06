import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Calculator,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileText,
  Home,
  ListChecks,
  PackageCheck,
  PackageX,
  Pencil,
  ReceiptText,
  Scale,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Button from '../../components/ui/Button';
import { useEmpresaDashboard } from '../../hooks/useEmpresaDashboard';

import type {
  EvolucionPuntoGrafico,
  FinanzasDashboard,
  MiembroEquipoDashboard,
} from '../../types/empresa-dashboard.types';

type PeriodoGrafico = 'ultimoMes' | 'tresMeses' | 'cicloLectivo';

function formatearMoneda(valor: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

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

/* =========================================================
 * RESUMEN FINANCIERO
 * ======================================================= */

interface TarjetaFinancieraProps {
  titulo: string;
  valor: number;
  variacion: number;
  icono: React.ReactNode;
  tipo?: 'normal' | 'ingreso' | 'egreso' | 'resultado';
}

function TarjetaFinanciera({
  titulo,
  valor,
  variacion,
  icono,
  tipo = 'normal',
}: TarjetaFinancieraProps) {
  const variacionPositiva = variacion >= 0;

  const clasesIcono = {
    normal: 'bg-gray-100 text-gray-600',
    ingreso: 'bg-emerald-50 text-emerald-700',
    egreso: 'bg-red-50 text-red-600',
    resultado: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <article className="rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${clasesIcono[tipo]}`}
        >
          {icono}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-700">{titulo}</p>

          <p
            className={`mt-0.5 truncate text-2xl font-bold ${
              tipo === 'resultado'
                ? valor >= 0
                  ? 'text-emerald-700'
                  : 'text-red-600'
                : 'text-gray-900'
            }`}
          >
            {formatearMoneda(valor)}
          </p>

          <div className="mt-1.5 flex items-center gap-1 text-xs">
            {variacionPositiva ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}

            <span className={variacionPositiva ? 'text-emerald-700' : 'text-red-600'}>
              {variacionPositiva ? '+' : ''}
              {variacion.toFixed(1)}%
            </span>

            <span className="text-gray-400">vs. mes anterior</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ResumenFinancieroDashboard({ finanzas }: { finanzas: FinanzasDashboard }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <TarjetaFinanciera
        titulo="Caja disponible"
        valor={finanzas.cajaDisponible}
        variacion={finanzas.variacionCajaPorcentaje}
        icono={<WalletCards className="h-5 w-5" />}
      />

      <TarjetaFinanciera
        titulo="Ingresos acumulados"
        valor={finanzas.ingresosAcumulados}
        variacion={finanzas.variacionIngresosPorcentaje}
        icono={<TrendingUp className="h-5 w-5" />}
        tipo="ingreso"
      />

      <TarjetaFinanciera
        titulo="Egresos acumulados"
        valor={finanzas.egresosAcumulados}
        variacion={finanzas.variacionEgresosPorcentaje}
        icono={<TrendingDown className="h-5 w-5" />}
        tipo="egreso"
      />

      <TarjetaFinanciera
        titulo="Resultado acumulado"
        valor={finanzas.resultadoAcumulado}
        variacion={finanzas.variacionResultadoPorcentaje}
        icono={<Scale className="h-5 w-5" />}
        tipo="resultado"
      />
    </section>
  );
}

/* =========================================================
 * GRÁFICO
 * ======================================================= */

interface GraficoEvolucionProps {
  ultimoMes: EvolucionPuntoGrafico[];
  tresMeses: EvolucionPuntoGrafico[];
  cicloLectivo: EvolucionPuntoGrafico[];
}

function GraficoEvolucionFinanciera({ ultimoMes, tresMeses, cicloLectivo }: GraficoEvolucionProps) {
  const [periodo, setPeriodo] = useState<PeriodoGrafico>('tresMeses');

  const datosPorPeriodo: Record<PeriodoGrafico, EvolucionPuntoGrafico[]> = {
    ultimoMes,
    tresMeses,
    cicloLectivo,
  };

  const datos = datosPorPeriodo[periodo];

  const hayMovimientos = datos.some(
    (item) => item.ingresos !== 0 || item.egresos !== 0 || item.resultado !== 0
  );

  return (
    <section className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Evolución financiera</h2>

          <p className="mt-0.5 text-xs text-gray-500">
            Evolución de ingresos, egresos y resultado.
          </p>
        </div>

        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setPeriodo('ultimoMes')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              periodo === 'ultimoMes' ? 'bg-[#527052] text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Último mes
          </button>

          <button
            type="button"
            onClick={() => setPeriodo('tresMeses')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              periodo === 'tresMeses' ? 'bg-[#527052] text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Últimos 3 meses
          </button>

          <button
            type="button"
            onClick={() => setPeriodo('cicloLectivo')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              periodo === 'cicloLectivo'
                ? 'bg-[#527052] text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Ciclo lectivo
          </button>
        </div>
      </div>

      {!hayMovimientos ? (
        <div className="flex h-[240px] flex-col items-center justify-center">
          <CircleDollarSign className="h-8 w-8 text-gray-300" />

          <p className="mt-2.5 text-sm font-medium text-gray-500">
            No hay datos disponibles en este momento
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Los movimientos financieros se reflejarán en este gráfico.
          </p>
        </div>
      ) : (
        <div className="mt-4 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={datos}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />

              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(valor: number) =>
                  new Intl.NumberFormat('es-AR', {
                    notation: 'compact',
                    maximumFractionDigits: 1,
                  }).format(valor)
                }
              />

              <Tooltip formatter={(valor) => formatearMoneda(Number(valor))} />

              <Legend
                wrapperStyle={{
                  fontSize: '12px',
                }}
              />

              <Line
                type="monotone"
                dataKey="ingresos"
                name="Ingresos"
                stroke="#6366f1"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="egresos"
                name="Egresos"
                stroke="#fb7185"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="resultado"
                name="Resultado"
                stroke="#06b6d4"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

/* =========================================================
 * ACTIVIDAD PENDIENTE
 * ======================================================= */

interface FilaActividadProps {
  icono: React.ReactNode;
  titulo: string;
  cantidad: number;
  textoBoton: string;
  onClick: () => void;
}

function FilaActividad({ icono, titulo, cantidad, textoBoton, onClick }: FilaActividadProps) {
  return (
    <div className="flex min-h-[46px] items-center gap-3 border-b border-gray-100 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf1eb] text-[#527052]">
        {icono}
      </div>

      <p className="min-w-0 flex-1 text-sm font-medium text-gray-800">{titulo}</p>

      <span
        className={`flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${
          cantidad > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {cantidad}
      </span>

      <button
        type="button"
        onClick={onClick}
        className="hidden min-w-[100px] rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
      >
        {textoBoton}
      </button>
    </div>
  );
}

/* =========================================================
 * INDICADORES
 * ======================================================= */

interface IndicadorProps {
  titulo: string;
  valor: React.ReactNode;
  icono: React.ReactNode;
}

function Indicador({ titulo, valor, icono }: IndicadorProps) {
  return (
    <div className="flex min-w-0 flex-1 items-start gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf1eb] text-[#527052]">
        {icono}
      </div>

      <div className="min-w-0">
        <p className="min-h-[32px] text-xs font-medium leading-4 text-gray-600">{titulo}</p>

        <p className="mt-0.5 text-xl font-bold text-gray-900">{valor}</p>
      </div>
    </div>
  );
}

/* =========================================================
 * EQUIPO
 * ======================================================= */

function MiembroEquipo({ miembro }: { miembro: MiembroEquipoDashboard }) {
  const rol = miembro.rolEmpresa?.nombreRol;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
        {obtenerIniciales(miembro.nombre, miembro.apellido)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-gray-800">
            {miembro.nombre} {miembro.apellido}
          </p>

          {miembro.esUsuarioActual && (
            <span className="shrink-0 text-[10px] font-medium text-emerald-600">(Vos)</span>
          )}
        </div>

        <p className="truncate text-xs text-gray-400">{miembro.email}</p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${obtenerClasesRol(
          rol
        )}`}
      >
        {rol ?? 'Sin rol'}
      </span>
    </div>
  );
}

/* =========================================================
 * PÁGINA
 * ======================================================= */

export default function MiEmpresaPage() {
  const navigate = useNavigate();

  const { data: dashboard, isLoading, isError, refetch } = useEmpresaDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#527052]" />

          <p className="mt-3 text-sm text-gray-500">Cargando información de la empresa...</p>
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="w-full max-w-[1600px]">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">No se pudo cargar la empresa</h2>

          <p className="mt-1 text-sm text-red-700">
            Ocurrió un problema al obtener la información del dashboard.
          </p>

          <div className="mt-4">
            <Button type="button" label="Reintentar" onClick={() => void refetch()} />
          </div>
        </div>
      </div>
    );
  }

  const { empresa, finanzas, graficoEvolucion, actividadPendiente, indicadoresNegocio, equipo } =
    dashboard;

  const usuarioActual = equipo.miembros.find((miembro) => miembro.esUsuarioActual);

  const esCEO = usuarioActual?.rolEmpresa?.nombreRol.toUpperCase() === 'CEO';

  return (
    <div className="w-full max-w-[1600px] space-y-4">
      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Mi empresa</span>
      </nav>

      {/* =====================================================
          EMPRESA
      ====================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {empresa.logoUrl ? (
            <img
              src={empresa.logoUrl}
              alt={`Logo de ${empresa.nombre}`}
              className="h-16 w-16 shrink-0 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Building2 className="h-8 w-8" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold text-gray-900">{empresa.nombre}</h1>

            <p className="mt-0.5 text-sm text-gray-600">{empresa.actividad}</p>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <Users className="h-4 w-4" />

              <span>
                {empresa.cantidadIntegrantes} de {empresa.limiteIntegrantes} integrantes
              </span>

              {empresa.activo && (
                <>
                  <span className="text-gray-300">•</span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Empresa activa
                  </span>
                </>
              )}
            </div>
          </div>

          {esCEO && (
            <Button
              type="button"
              label="Editar datos"
              icon={<Pencil className="h-4 w-4" />}
              onClick={() => navigate('/alumno/empresa/editar')}
            />
          )}
        </div>
      </section>

      {/* =====================================================
          RESUMEN FINANCIERO
      ====================================================== */}

      <ResumenFinancieroDashboard finanzas={finanzas} />

      {/* =====================================================
          GRÁFICO + ACTIVIDAD
      ====================================================== */}

      <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(400px,1fr)]">
        <GraficoEvolucionFinanciera
          ultimoMes={graficoEvolucion.ultimoMes}
          tresMeses={graficoEvolucion.tresMeses}
          cicloLectivo={graficoEvolucion.cicloLectivo}
        />

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Actividad pendiente</h2>

            <p className="mt-0.5 text-xs text-gray-500">Tareas que requieren atención.</p>
          </div>

          <div className="mt-2">
            <FilaActividad
              icono={<ClipboardList className="h-4 w-4" />}
              titulo="Pedidos pendientes"
              cantidad={actividadPendiente.pedidosPendientes}
              textoBoton="Ir a pedidos"
              onClick={() => navigate('/alumno/pedidos')}
            />

            <FilaActividad
              icono={<PackageCheck className="h-4 w-4" />}
              titulo="Pedidos listos para entregar"
              cantidad={actividadPendiente.pedidosListosParaEntregar}
              textoBoton="Ir a pedidos"
              onClick={() => navigate('/alumno/pedidos')}
            />

            <FilaActividad
              icono={<ReceiptText className="h-4 w-4" />}
              titulo="Facturas pendientes de emisión"
              cantidad={actividadPendiente.facturasPendientes}
              textoBoton="Ir a facturación"
              onClick={() => navigate('/alumno/facturacion')}
            />

            <FilaActividad
              icono={<FileText className="h-4 w-4" />}
              titulo="Asientos contables pendientes"
              cantidad={actividadPendiente.asientosContablesPendientes}
              textoBoton="Ir a contabilidad"
              onClick={() => navigate('/alumno/contabilidad')}
            />

            <FilaActividad
              icono={<Factory className="h-4 w-4" />}
              titulo="Órdenes de producción pendientes"
              cantidad={actividadPendiente.ordenesProduccionPendientes}
              textoBoton="Ir a producción"
              onClick={() => navigate('/alumno/produccion')}
            />
          </div>
        </section>
      </div>

      {/* =====================================================
          INDICADORES + EQUIPO
      ====================================================== */}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.25fr)_minmax(340px,0.85fr)]">
        {/* ===================================================
            INDICADORES
        ==================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-900">Indicadores del negocio</h2>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            <Indicador
              titulo="Ventas realizadas"
              valor={indicadoresNegocio.ventasRealizadas}
              icono={<BadgeDollarSign className="h-4 w-4" />}
            />

            <Indicador
              titulo="Pedidos completados / recibidos"
              valor={`${indicadoresNegocio.pedidosCompletados} / ${indicadoresNegocio.pedidosRecibidos}`}
              icono={<ClipboardCheck className="h-4 w-4" />}
            />

            <Indicador
              titulo="Pedidos con faltantes"
              valor={indicadoresNegocio.pedidosConFaltante}
              icono={<PackageX className="h-4 w-4" />}
            />

            <Indicador
              titulo="Precisión contable"
              valor={
                indicadoresNegocio.precisionContable === null
                  ? 'Sin datos'
                  : `${indicadoresNegocio.precisionContable.toFixed(1)}%`
              }
              icono={<Calculator className="h-4 w-4" />}
            />

            <Indicador
              titulo="Órdenes completadas / totales"
              valor={`${indicadoresNegocio.ordenesCompletadas} / ${indicadoresNegocio.ordenesTotales}`}
              icono={<ListChecks className="h-4 w-4" />}
            />

            <Indicador
              titulo="Rentabilidad"
              valor={`${indicadoresNegocio.rentabilidadPorcentaje.toFixed(1)}%`}
              icono={<ChartNoAxesCombined className="h-4 w-4" />}
            />
          </div>
        </section>

        {/* ===================================================
            MI EQUIPO
        ==================================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Mi equipo</h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {equipo.miembros.length} de {empresa.limiteIntegrantes} integrantes
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/alumno/empresa/equipo')}
              className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#527052] transition hover:opacity-70"
            >
              Ver equipo
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Integrantes */}

          {equipo.miembros.length === 0 ? (
            <div className="flex min-h-[80px] items-center justify-center">
              <p className="text-sm text-gray-500">No hay datos disponibles en este momento</p>
            </div>
          ) : (
            <div className="mt-2 divide-y divide-gray-100">
              {equipo.miembros.slice(0, 5).map((miembro) => (
                <MiembroEquipo key={miembro.id} miembro={miembro} />
              ))}
            </div>
          )}

          {/* Invitaciones pendientes */}

          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-gray-700">Invitaciones pendientes</p>

              {equipo.invitacionesPendientes.length > 0 && (
                <span className="flex min-w-6 items-center justify-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                  {equipo.invitacionesPendientes.length}
                </span>
              )}
            </div>

            {equipo.invitacionesPendientes.length === 0 ? (
              <p className="mt-2 text-xs text-gray-400">No hay invitaciones pendientes</p>
            ) : (
              <div className="mt-2 space-y-2">
                {equipo.invitacionesPendientes.slice(0, 3).map((invitacion) => (
                  <div key={invitacion.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <Users className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-700">
                        {invitacion.email}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
                      Pendiente
                    </span>
                  </div>
                ))}

                {equipo.invitacionesPendientes.length > 3 && (
                  <button
                    type="button"
                    onClick={() => navigate('/alumno/empresa/equipo')}
                    className="text-xs font-medium text-[#527052] transition hover:opacity-70"
                  >
                    Ver todas las invitaciones
                  </button>
                )}
              </div>
            )}

            {/* Agregar integrante - solo CEO */}

            {esCEO && (
              <button
                type="button"
                onClick={() => navigate('/alumno/empresa/equipo')}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#668b64] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#567654]"
              >
                <UserPlus className="h-4 w-4" />
                Agregar integrante
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
