export type PeriodoGraficoFinanciero = 'mes' | '6meses' | 'ciclo';

export type TipoMovimientoNombre = 'INGRESO' | 'EGRESO';

export interface ResumenMesActual {
  ingresos: number;
  egresos: number;
}

export interface ResumenFinanciero {
  totalIngresos: number;
  totalEgresos: number;
  flujoNeto: number;
  mesActual: ResumenMesActual;
}

export interface DatoGraficoFinanciero {
  label: string;
  ingresos: number;
  egresos: number;
}

export interface MovimientoFinanciero {
  idMovimiento: number;
  fecha: string;
  concepto: string;
  importe: number;
  categoria: string;
  tipoMovimiento: string;
  idTipoMovimiento: number;
  metodoPago: string;
}

export interface MovimientosFinancierosResponse {
  items: MovimientoFinanciero[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface MovimientosFinancierosQueryParams {
  page?: number;
  pageSize?: number;
  mes?: number;
  idTipoMovimiento?: number;
}

export interface TipoMovimiento {
  idTipoMovimiento: number;
  nombre: string;
}

export interface CategoriaFinanciera {
  idCategoria: number;
  nombre: string;
  descripcion: string | null;
}

export interface CategoriasFinancierasAgrupadas {
  ingreso: CategoriaFinanciera[];
  egreso: CategoriaFinanciera[];
}

export interface RegistrarMovimientoRequest {
  fecha: string;
  idCategoria: number;
  concepto: string;
  importe: number;
  idMetodoPago: number;
  observaciones?: string;
}
export interface ResumenConciliacion {
  saldoEsperado: number;
  movimientosPeriodo: number;
  ultimaConciliacion: string | null;
}

export interface RegistrarConciliacionRequest {
  saldoEsperado: number;
  saldoContado: number;
  observacion?: string;
}

export interface ConciliacionRegistrada {
  idConciliacion: number;
  empresaId: number;
  alumnoId: string;
  fecha: string;
  saldoEsperado: number;
  saldoContado: number;
  diferencia: number;
  observacion: string | null;
  createdAt?: string;
}

export interface ConciliacionHistorialItem {
  idConciliacion: number;
  fecha: string;
  alumno: string;
  saldoEsperado: number;
  saldoContado: number;
  diferencia: number;
  observacion: string | null;
}

export interface ConciliacionesResponse {
  items: ConciliacionHistorialItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ConciliacionesQueryParams {
  page?: number;
  pageSize?: number;
}
