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
