export type TipoSaldoLibroMayor = 'DEUDOR' | 'ACREEDOR' | 'SALDADA';

export interface CuentaLibroMayorItemDTO {
  cuentaId: number;
  codigo: string;
  nombre: string;
  tipoCuenta: string;
  numeroFolio: number | null;
  totalDebito: number;
  totalCredito: number;
  saldo: number;
  tipoSaldo: TipoSaldoLibroMayor;
  esSaldoCorrecto: boolean;
  mensajeError: string | null;
}

export type TipoResultadoEjercicio = 'GANANCIA' | 'PERDIDA' | 'NEUTRO';

export interface CuentaReporteItemDTO {
  cuentaId: number;
  codigo: string;
  nombre: string;
  saldo: number;
}

export interface EstadoResultadosResponseDTO {
  ingresos: CuentaReporteItemDTO[];
  egresos: CuentaReporteItemDTO[];
  totalIngresos: number;
  totalEgresos: number;
  resultadoEjercicio: number;
  tipoResultado: TipoResultadoEjercicio;
}

export interface BalanceGeneralResponseDTO {
  activos: CuentaReporteItemDTO[];
  pasivos: CuentaReporteItemDTO[];
  patrimonioNeto: CuentaReporteItemDTO[];
  resultadoEjercicio: number;
  tipoResultadoEjercicio: TipoResultadoEjercicio;
  totalActivo: number;
  totalPasivo: number;
  totalPatrimonioNeto: number;
  totalPasivoMasPatrimonioNeto: number;
  esBalanceEquilibrado: boolean;
  mensajeError: string | null;
}
