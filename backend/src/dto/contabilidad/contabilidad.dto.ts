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

export interface CuentaResultadoItemDTO {
  cuentaId: number;
  codigo: string;
  nombre: string;
  saldo: number;
}

export interface EstadoResultadosResponseDTO {
  ingresos: CuentaResultadoItemDTO[];
  egresos: CuentaResultadoItemDTO[];
  totalIngresos: number;
  totalEgresos: number;
  resultadoEjercicio: number;
  tipoResultado: TipoResultadoEjercicio;
}

