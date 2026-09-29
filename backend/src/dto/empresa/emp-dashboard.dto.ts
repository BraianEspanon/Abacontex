export interface EmpresaInfoDashboardDTO {
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

export interface FinanzasDashboardDTO {
  cajaDisponible: number;
  variacionCajaPorcentaje: number;
  ingresosAcumulados: number;
  variacionIngresosPorcentaje: number;
  egresosAcumulados: number;
  variacionEgresosPorcentaje: number;
  resultadoAcumulado: number;
  variacionResultadoPorcentaje: number;
}

export interface EvolucionPuntoGraficoDTO {
  periodo: string;
  ingresos: number;
  egresos: number;
  resultado: number;
}

export interface GraficoEvolucionFinancieraDTO {
  ultimoMes: EvolucionPuntoGraficoDTO[];
  tresMeses: EvolucionPuntoGraficoDTO[];
  cicloLectivo: EvolucionPuntoGraficoDTO[];
}

export interface ActividadPendienteDashboardDTO {
  pedidosPendientes: number;
  pedidosListosParaEntregar: number;
  ordenesProduccionPendientes: number;
  facturasPendientes: number;
  asientosContablesPendientes: number;
  ejerciciosSinResolver: number;
}

export interface IndicadoresNegocioDashboardDTO {
  ventasRealizadas: number;
  pedidosCompletados: number;
  pedidosRecibidos: number;
  productosStockCritico: number;
  precisionContable: number | null;
  ordenesCompletadas: number;
  ordenesTotales: number;
  rentabilidadPorcentaje: number;
}

export interface MiembroEquipoDashboardDTO {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rolEmpresa: {
    idRol: number;
    nombreRol: string;
  } | null;
  esUsuarioActual: boolean;
}

export interface InvitacionPendienteDashboardDTO {
  id: number;
  email: string;
  createdAt: Date;
  fechaExpiracion: Date;
}

export interface EquipoDashboardDTO {
  miembros: MiembroEquipoDashboardDTO[];
  invitacionesPendientes: InvitacionPendienteDashboardDTO[];
}

export interface DesempenoDashboardDTO {
  posicionRanking: number | null;
  totalEmpresas: number | null;
  puntajeTotal: number | null;
  desgloseDimensiones: {
    comercial?: number | null;
    operativo?: number | null;
    contable?: number | null;
  } | null;
}

export interface RankingItemDashboardDTO {
  posicion: number;
  nombreEmpresa: string;
  puntaje: number;
  esEmpresaActual: boolean;
}

export interface RankingDashboardDTO {
  posicionActual: number | null;
  totalEmpresas: number | null;
  top: RankingItemDashboardDTO[];
}

export interface LogrosDashboardDTO {
  logrosDesbloqueados: Array<{
    id: number;
    nombre: string;
    descripcion: string;
  }>;
  proximosObjetivos: Array<{
    id: number;
    nombre: string;
    descripcion: string;
    progreso: number;
  }>;
}

export interface EmpresaDashboardResponseDTO {
  empresa: EmpresaInfoDashboardDTO;
  finanzas: FinanzasDashboardDTO;
  graficoEvolucion: GraficoEvolucionFinancieraDTO;
  actividadPendiente: ActividadPendienteDashboardDTO;
  indicadoresNegocio: IndicadoresNegocioDashboardDTO;
  equipo: EquipoDashboardDTO;
  desempeno: DesempenoDashboardDTO | null;
  ranking: RankingDashboardDTO | null;
  logros: LogrosDashboardDTO | null;
}
