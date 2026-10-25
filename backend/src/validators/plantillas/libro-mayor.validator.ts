import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';
import { fechaContableOpcionalSchema } from './fecha-contable.validator';

/* ==========================================================================
 * Plantilla: LIBRO MAYOR (Formato T)
 * ========================================================================== */

export const TIPOS_SALDO_MAYOR = ['DEUDOR', 'ACREEDOR', 'SALDADA'] as const;
export type TipoSaldoMayor = (typeof TIPOS_SALDO_MAYOR)[number];

/**
 * Movimiento individual en uno de los lados de la cuenta T (Debe o Haber).
 * En la cuenta T, cada movimiento registra la fecha, la contracuenta seleccionada
 * desde el plan de cuentas (idContraCuenta y contraCuenta) y el monto debitado o acreditado.
 */
export const lineaMayorTSchema = z
  .object({
    fecha: fechaContableOpcionalSchema,
    idContraCuenta: z
      .number()
      .int('El ID de la contracuenta debe ser un número entero.')
      .positive('Debe seleccionar una contracuenta válida del plan de cuentas.'),
    contraCuenta: z.string().trim().min(1, 'La contracuenta no puede estar vacía.'),
    monto: z.number().min(0, 'El monto no puede ser negativo.').default(0),
  })
  .strict();

export type LineaMayorTDTO = z.infer<typeof lineaMayorTSchema>;

// Alias para mantener compatibilidad de tipos
export const movimientoMayorSchema = lineaMayorTSchema;
export type MovimientoMayorDTO = LineaMayorTDTO;

/**
 * Card de la Cuenta Mayorizada en Formato T.
 * Recibe únicamente los datos ingresados por el usuario:
 * identificación de la cuenta, sus columnas Debe/Haber y la interpretación del tipo de saldo.
 * Los totales y saldos son calculados automáticamente por el sistema.
 */
export const cuentaMayorSchema = z
  .object({
    idCuenta: z
      .number()
      .int('El ID de la cuenta debe ser un número entero.')
      .positive('El ID de la cuenta debe ser mayor a cero.'),
    cuenta: z.string().trim().min(1, 'La cuenta no puede estar vacía.'),
    debe: z.array(lineaMayorTSchema).default([]),
    haber: z.array(lineaMayorTSchema).default([]),
    tipoSaldo: z.enum(TIPOS_SALDO_MAYOR).optional().nullable(),
  })
  .strict();

export type CuentaMayorDTO = z.infer<typeof cuentaMayorSchema>;

export const libroMayorContenidoSchema = z
  .object({
    cuentas: z.array(cuentaMayorSchema).default([]),
  })
  .strict();

export type LibroMayorContenidoDTO = z.infer<typeof libroMayorContenidoSchema>;

export interface TotalesCuentaMayorDTO {
  totalDebe: number;
  totalHaber: number;
  saldoCalculado: number;
  tipoSaldoCalculado: TipoSaldoMayor;
}

/**
 * Función utilitaria para calcular los totales y saldo de una cuenta mayorizada en formato T.
 */
export function calcularTotalesCuentaMayor(cuenta: {
  debe: LineaMayorTDTO[];
  haber: LineaMayorTDTO[];
}): TotalesCuentaMayorDTO {
  const totalDebe = Number(cuenta.debe.reduce((acc, l) => acc + (l.monto || 0), 0).toFixed(2));
  const totalHaber = Number(cuenta.haber.reduce((acc, l) => acc + (l.monto || 0), 0).toFixed(2));
  const diferencia = Number((totalDebe - totalHaber).toFixed(2));
  const saldoCalculado = Math.abs(diferencia);

  let tipoSaldoCalculado: TipoSaldoMayor;
  if (diferencia > 0) {
    tipoSaldoCalculado = 'DEUDOR';
  } else if (diferencia < 0) {
    tipoSaldoCalculado = 'ACREEDOR';
  } else {
    tipoSaldoCalculado = 'SALDADA';
  }

  return {
    totalDebe,
    totalHaber,
    saldoCalculado,
    tipoSaldoCalculado,
  };
}

export function validarBalanceLibroMayor(contenido: unknown): void {
  const parsed = libroMayorContenidoSchema.safeParse(contenido);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Estructura de Libro Mayor inválida.';
    throw new BadRequestError(errorMsg);
  }

  const { cuentas } = parsed.data;

  // 1. Al menos una cuenta registrada
  if (cuentas.length === 0) {
    throw new BadRequestError(
      'Para marcar el Libro Mayor como RESUELTO debe registrar al menos una cuenta mayorizada.'
    );
  }

  // 2. Unicidad de cuentas (no duplicar idCuenta)
  const cuentasSet = new Set<number>();
  for (const c of cuentas) {
    if (cuentasSet.has(c.idCuenta)) {
      throw new BadRequestError(
        `La cuenta contable "${c.cuenta}" (ID ${c.idCuenta}) se encuentra repetida en el Libro Mayor.`
      );
    }
    cuentasSet.add(c.idCuenta);
  }

  // 3. Validaciones por cuenta y líneas en formato T
  for (const c of cuentas) {
    const totalLineas = c.debe.length + c.haber.length;
    if (totalLineas === 0) {
      throw new BadRequestError(
        `La cuenta "${c.cuenta}" debe tener al menos un movimiento registrado (en el Debe o en el Haber).`
      );
    }

    // Validar líneas del Debe
    for (const [index, linea] of c.debe.entries()) {
      const nroFila = index + 1;

      if (linea.monto <= 0) {
        throw new BadRequestError(
          `En la cuenta "${c.cuenta}", el movimiento N° ${nroFila} del Debe debe tener un monto mayor a cero.`
        );
      }

      if (linea.idContraCuenta === c.idCuenta) {
        throw new BadRequestError(
          `En la cuenta "${c.cuenta}", el movimiento N° ${nroFila} del Debe no puede tener a la misma cuenta como contracuenta.`
        );
      }
    }

    // Validar líneas del Haber
    for (const [index, linea] of c.haber.entries()) {
      const nroFila = index + 1;

      if (linea.monto <= 0) {
        throw new BadRequestError(
          `En la cuenta "${c.cuenta}", el movimiento N° ${nroFila} del Haber debe tener un monto mayor a cero.`
        );
      }

      if (linea.idContraCuenta === c.idCuenta) {
        throw new BadRequestError(
          `En la cuenta "${c.cuenta}", el movimiento N° ${nroFila} del Haber no puede tener a la misma cuenta como contracuenta.`
        );
      }
    }

    // 4. Tipo de saldo obligatorio
    if (!c.tipoSaldo) {
      throw new BadRequestError(
        `Debe indicar el tipo de saldo (DEUDOR, ACREEDOR o SALDADA) para la cuenta "${c.cuenta}".`
      );
    }

    // 5. Coherencia contable del saldo
    const { totalDebe, totalHaber, saldoCalculado } = calcularTotalesCuentaMayor(c);

    if (saldoCalculado > 0) {
      if (totalDebe > totalHaber && c.tipoSaldo !== 'DEUDOR') {
        throw new BadRequestError(
          `El tipo de saldo de la cuenta "${c.cuenta}" debe ser DEUDOR (Total Debe: $ ${totalDebe} > Total Haber: $ ${totalHaber}).`
        );
      }

      if (totalHaber > totalDebe && c.tipoSaldo !== 'ACREEDOR') {
        throw new BadRequestError(
          `El tipo de saldo de la cuenta "${c.cuenta}" debe ser ACREEDOR (Total Haber: $ ${totalHaber} > Total Debe: $ ${totalDebe}).`
        );
      }
    } else {
      if (c.tipoSaldo !== 'SALDADA') {
        throw new BadRequestError(
          `El tipo de saldo de la cuenta "${c.cuenta}" debe ser SALDADA (Total Debe y Haber coinciden: $ ${totalDebe}).`
        );
      }
    }
  }
}
