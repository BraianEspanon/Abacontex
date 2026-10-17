export type EstadoEjercicio =
  | 'BORRADOR'
  | 'ENVIADO'
  | 'SIN_RESOLVER'
  | 'EN_CORRECCION'
  | 'COMPLETADO';

export interface CursoEjercicio {
  idCurso: number;
  nombreCurso: string;
  año: number;
}

export interface EjercicioItem {
  idEjercicio: number;
  titulo: string;
  curso: CursoEjercicio;
  estado: EstadoEjercicio;
  fechaLimite: string;
  totalEntregas: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumenEjercicios {
  total: number;
  enviados: number;
  sinResolver: number;
  resueltos: number;
  enCorreccion?: number;
}

export interface ListadoEjerciciosResponse {
  items: EjercicioItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  resumen: ResumenEjercicios;
}

export interface FiltrosEjercicios {
  page?: number;
  pageSize?: number;
  cursoId?: number;
  titulo?: string;
  estado?: string;
}

export interface DigitalizarEjercicioResponse {
  enunciadoTexto: string;
}

export type TipoPlantillaEjercicio = 'LIBRO_DIARIO' | 'LIBRO_MAYOR' | 'LIBRO_IVA' | 'HOJA_TRABAJO';

export interface CrearEjercicioRequest {
  titulo: string;
  cursoId: number;
  enunciado: string;
  fechaLimite: string;
  indicaciones?: string | null;
  estado: 'BORRADOR' | 'ENVIADO';
  plantillas: TipoPlantillaEjercicio[];
  generacionIA?: {
    tipoEjercicio: TipoEjercicioIA;
    dificultad: DificultadEjercicioIA;
    contextoAdicional?: string | null;
    contenidos: ContenidoAdicionalIA[];
  } | null;
}

export interface EjercicioCreadoResponse {
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  estado: string;
  indicaciones: string | null;
  fechaLimite: string;
  curso: {
    idCurso: number;
    nombreCurso: string;
    año: number;
  };
  plantillas: {
    idEjercicioPlantilla: number;
    tipo: string;
  }[];
  generacionIA: null;
  resolucion: {
    idResolucion: number;
    estado: EstadoResolucionDocente;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export type TipoEjercicioIA =
  | 'COMPRAS_VENTAS_BASICAS'
  | 'OPERACIONES_COMERCIALES_INTEGRADAS'
  | 'AJUSTES_HOJA_TRABAJO'
  | 'COSTOS_PROCESO_PRODUCTIVO';

export type DificultadEjercicioIA = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';

export type ContenidoAdicionalIA = 'IVA' | 'INTERESES' | 'DESCUENTOS';

export interface GenerarEjercicioIARequest {
  cursoId: number;
  tipoEjercicio: TipoEjercicioIA;
  dificultad: DificultadEjercicioIA;
  contenidosAdicionales: ContenidoAdicionalIA[];
  contextoAdicional?: string;
}

export interface GenerarEjercicioIAResponse {
  enunciadoTexto: string;
}

export interface PlantillaDetalleEjercicio {
  idEjercicioPlantilla: number;
  tipo: TipoPlantillaEjercicio;
}

export interface GeneracionIADetalle {
  tipoEjercicio: TipoEjercicioIA;
  dificultad: DificultadEjercicioIA;
  contextoAdicional?: string | null;
  contenidos: ContenidoAdicionalIA[];
}

// ============================================================================
// Resolución docente
// ============================================================================

export type EstadoResolucionDocente = 'PENDIENTE' | 'EN_EDICION' | 'RESUELTO';

export type EstadoPlantillaResolucion = 'PENDIENTE' | 'EN_EDICION' | 'RESUELTO';

export interface DetalleEjercicio {
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  estado: EstadoEjercicio;
  fechaLimite: string;
  createdAt: string;
  updatedAt: string;

  progresoEntregas: {
    totalAlumnos: number;
    entregasCorregidas: number;
    entregasPendientes: number;
    sinEntregar: number;
    porcentajeEntrega: number;
  };

  resolucionDocente: {
    idResolucion: number;
    estado: EstadoResolucionDocente;
  } | null;

  origen: 'IA' | 'DIGITALIZADO';

  curso: {
    idCurso: number;
    nombreCurso: string;
    año?: number;
  };

  plantillas: PlantillaDetalleEjercicio[];

  generacionIA: GeneracionIADetalle | null;
}

export interface EditarEjercicioRequest {
  titulo?: string;
  cursoId?: number;
  enunciado?: string;
  fechaLimite?: string;
  indicaciones?: string | null;
  estado?: 'BORRADOR' | 'ENVIADO';
  plantillas?: TipoPlantillaEjercicio[];
}

// ============================================================================
// Libro Diario
// ============================================================================

export type MovimientoContable = 'A+' | 'A-' | 'P+' | 'P-' | 'PN+' | 'PN-' | 'R+' | 'R-';

export interface LineaLibroDiario {
  idCuenta: number;
  cuenta: string;
  movimiento: MovimientoContable;
  folio?: number | null;
  debe: number;
  haber: number;
}

export interface AsientoLibroDiario {
  numero: number;
  fecha: string;
  concepto: string;
  lineas: LineaLibroDiario[];
}

export interface ContenidoLibroDiario {
  asientos: AsientoLibroDiario[];
}

// ============================================================================
// Libro Mayor
// ============================================================================

/**
 * El backend determina automáticamente el importe del saldo.
 * El docente únicamente indica su interpretación contable.
 *
 * SALDADA se utiliza cuando Total Debe === Total Haber.
 */
export type TipoSaldoMayor = 'DEUDOR' | 'ACREEDOR' | 'SALDADA';

/**
 * Movimiento de uno de los lados de una cuenta T.
 *
 * La contracuenta se selecciona desde el Plan de Cuentas.
 * `monto` representa el importe registrado en el Debe o Haber,
 * dependiendo del arreglo al que pertenezca la línea.
 */
export interface LineaLibroMayor {
  fecha: string;
  idContraCuenta: number;
  contraCuenta: string;
  monto: number;
}

/**
 * Cuenta mayorizada en formato T.
 *
 * Los totales Debe/Haber y el saldo final son valores derivados,
 * por lo que no se persisten en el contenido.
 */
export interface CuentaLibroMayor {
  idCuenta: number;
  cuenta: string;
  debe: LineaLibroMayor[];
  haber: LineaLibroMayor[];
  tipoSaldo: TipoSaldoMayor | null;
}

export interface ContenidoLibroMayor {
  cuentas: CuentaLibroMayor[];
}

// ============================================================================
// Libro IVA
// ============================================================================

export type TipoResultadoIva = 'A_FAVOR_CONTRIBUYENTE' | 'A_PAGAR';

export interface ComprobanteIva {
  fecha: string;
  comprobante: number;
  nombre: string;
  netoGravado: number;
  iva: number;
  total: number;
}

export interface ContenidoLibroIva {
  compras: ComprobanteIva[];
  ventas: ComprobanteIva[];
  resultado: TipoResultadoIva | null;
}

export interface LiquidacionIva {
  totalNetoCompras: number;
  totalIvaCreditoFiscal: number;
  totalCompras: number;
  totalNetoVentas: number;
  totalIvaDebitoFiscal: number;
  totalVentas: number;
  saldoIva: number;
  resultadoCalculado: TipoResultadoIva;
}

// ============================================================================
// Hoja de Trabajo
// ============================================================================

export interface ParSaldosHojaTrabajo {
  deudor: number;
  acreedor: number;
}

export interface ParAjustesHojaTrabajo {
  debe: number;
  haber: number;
}

export interface ParSaldosAjustadosHojaTrabajo {
  deudor: number;
  acreedor: number;
}

export interface ParPatrimonialHojaTrabajo {
  activo: number;
  pasivoMasPn: number;
}

export interface ParResultadosHojaTrabajo {
  negativo: number;
  positivo: number;
}

export interface FilaHojaTrabajo {
  idCuenta: number;
  cuenta: string;
  saldosSinAjustar: ParSaldosHojaTrabajo;
  ajustes: ParAjustesHojaTrabajo;
  saldosAjustados: ParSaldosAjustadosHojaTrabajo;
  estadoPatrimonial: ParPatrimonialHojaTrabajo;
  estadoResultados: ParResultadosHojaTrabajo;
}

export interface ContenidoHojaTrabajo {
  filas: FilaHojaTrabajo[];
}

// ============================================================================
// Contenido de las plantillas de resolución
// ============================================================================

export type ContenidoResolucionPlantilla =
  | ContenidoLibroDiario
  | ContenidoLibroMayor
  | ContenidoLibroIva
  | ContenidoHojaTrabajo;

export interface PlantillaResolucionDocente {
  idEjercicioPlantilla: number;
  tipo: TipoPlantillaEjercicio;
  estado: EstadoPlantillaResolucion;
  contenido: ContenidoResolucionPlantilla | null;
  updatedAt?: string | null;
}

export interface ResolucionDocenteResponse {
  idResolucion: number;
  idEjercicio: number;
  titulo: string;
  enunciado: string;
  fechaLimite: string;
  estado: EstadoResolucionDocente;
  plantillas: PlantillaResolucionDocente[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ActualizarResolucionDocenteRequest {
  tipo: TipoPlantillaEjercicio;
  estado: Extract<EstadoPlantillaResolucion, 'EN_EDICION' | 'RESUELTO'>;
  contenido: unknown;
}

// ============================================================================
// Cuentas contables utilizadas en la resolución
// ============================================================================

export interface CuentaContableEjercicio {
  idCuenta: number;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  rubro: {
    idRubro: number;
    nombre: string;
    tipoCuenta: {
      idTipoCuenta: number;
      nombre: string;
      abreviatura: string;
    };
  };
}

export interface CuentasContablesResponse {
  items: CuentaContableEjercicio[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
