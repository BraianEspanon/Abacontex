export interface EmpresaInfoDashboard {
  id: number;
  nombre: string;
  actividad: string;
  logoUrl: string | null;
  activo: boolean;
  cantidadIntegrantes: number;
  limiteIntegrantes: number;
  posicionRanking: number | null;
  totalEmpresas: number | null;
  puntajeEmpresarial: number | null;
}

export interface FinanzasDashboard {
  cajaDisponible: number;
  variacionCajaPorcentaje: number;
  ingresosAcumulados: number;
  variacionIngresosPorcentaje: number;
  egresosAcumulados: number;
  variacionEgresosPorcentaje: number;
  resultadoAcumulado: number;
  variacionResultadoPorcentaje: number;
}

export interface EvolucionPuntoGrafico {
  periodo: string;
  ingresos: number;
  egresos: number;
  resultado: number;
}

export interface GraficoEvolucionFinanciera {
  ultimoMes: EvolucionPuntoGrafico[];
  tresMeses: EvolucionPuntoGrafico[];
  cicloLectivo: EvolucionPuntoGrafico[];
}

export interface ActividadPendienteDashboard {
  pedidosPendientes: number;
  pedidosListosParaEntregar: number;
  facturasPendientes: number;
  asientosContablesPendientes: number;
  ejerciciosSinResolver: number;
  simulacionesPendientes: number | null;
  ordenesProduccionPendientes: number;
}

export interface IndicadoresNegocioDashboard {
  ventasRealizadas: number;
  pedidosCompletados: number;
  pedidosRecibidos: number;
  pedidosConFaltante: number;
  precisionContable: number | null;
  ordenesCompletadas: number;
  ordenesTotales: number;
  rentabilidadPorcentaje: number;
}

export interface RolEmpresaDashboard {
  idRol: number;
  nombreRol: string;
}

export interface MiembroEquipoDashboard {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rolEmpresa: RolEmpresaDashboard | null;
  esUsuarioActual: boolean;
}

export interface InvitacionPendienteDashboard {
  id: number;
  email: string;
  createdAt: string;
  fechaExpiracion: string;
}

export interface EquipoDashboard {
  miembros: MiembroEquipoDashboard[];
  invitacionesPendientes: InvitacionPendienteDashboard[];
}

export interface DesgloseDimensionesDashboard {
  comercial?: number | null;
  operativo?: number | null;
  contable?: number | null;
}

export interface DesempenoDashboard {
  posicionRanking: number | null;
  totalEmpresas: number | null;
  puntajeTotal: number | null;
  desgloseDimensiones: DesgloseDimensionesDashboard | null;
}

export interface RankingItemDashboard {
  posicion: number;
  nombreEmpresa: string;
  puntaje: number;
  esEmpresaActual: boolean;
}

export interface RankingDashboard {
  posicionActual: number | null;
  totalEmpresas: number | null;
  top: RankingItemDashboard[];
}

export interface LogroDashboard {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ProximoObjetivoDashboard {
  id: number;
  nombre: string;
  descripcion: string;
  progreso: number;
}

export interface LogrosDashboard {
  logrosDesbloqueados: LogroDashboard[];
  proximosObjetivos: ProximoObjetivoDashboard[];
}

export interface EmpresaDashboardResponse {
  empresa: EmpresaInfoDashboard;
  finanzas: FinanzasDashboard;
  graficoEvolucion: GraficoEvolucionFinanciera;
  actividadPendiente: ActividadPendienteDashboard;
  indicadoresNegocio: IndicadoresNegocioDashboard;
  equipo: EquipoDashboard;
  desempeno: DesempenoDashboard | null;
  ranking: RankingDashboard | null;
  logros: LogrosDashboard | null;
}
