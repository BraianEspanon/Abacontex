import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';
import { fechaContableOpcionalSchema } from './fecha-contable.validator';

/* ==========================================================================
 * Plantilla: LIBRO MAYOR
 * ========================================================================== */

export const TIPOS_SALDO_MAYOR = ['DEUDOR', 'ACREEDOR'] as const;
export type TipoSaldoMayor = (typeof TIPOS_SALDO_MAYOR)[number];

export const movimientoMayorSchema = z
  .object({
    fecha: fechaContableOpcionalSchema,
    concepto: z.string().trim().default(''),
    debe: z
      .number('El importe al Debe debe ser numérico.')
      .min(0, 'El importe al Debe no puede ser negativo.')
      .default(0),
    haber: z
      .number('El importe al Haber debe ser numérico.')
      .min(0, 'El importe al Haber no puede ser negativo.')
      .default(0),
    saldo: z
      .number('El saldo debe ser numérico.')
      .min(0, 'El saldo no puede ser negativo.')
      .default(0),
  })
  .strict();

export type MovimientoMayorDTO = z.infer<typeof movimientoMayorSchema>;

export const cuentaMayorSchema = z
  .object({
    idCuenta: z
      .number('El ID de la cuenta es obligatorio y debe ser numérico.')
      .int('El ID de la cuenta debe ser un número entero.')
      .positive('El ID de la cuenta debe ser mayor a cero.'),
    cuenta: z
      .string('El nombre de la cuenta es obligatorio.')
      .trim()
      .min(1, 'El nombre de la cuenta no puede estar vacío.'),
    movimientos: z.array(movimientoMayorSchema).default([]),
    saldoFinal: z
      .number('El saldo final debe ser numérico.')
      .min(0, 'El saldo final no puede ser negativo.')
      .default(0),
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
 * Función utilitaria para calcular los totales y saldo de una cuenta mayorizada.
 */
export function calcularTotalesCuentaMayor(
  movimientos: MovimientoMayorDTO[]
): TotalesCuentaMayorDTO {
  const totalDebe = Number(movimientos.reduce((acc, m) => acc + (m.debe || 0), 0).toFixed(2));
  const totalHaber = Number(movimientos.reduce((acc, m) => acc + (m.haber || 0), 0).toFixed(2));
  const diferencia = Number((totalDebe - totalHaber).toFixed(2));
  const saldoCalculado = Math.abs(diferencia);
  const tipoSaldoCalculado: TipoSaldoMayor = diferencia >= 0 ? 'DEUDOR' : 'ACREEDOR';

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

  // 3. Validaciones por cuenta y movimientos
  for (const c of cuentas) {
    if (c.movimientos.length === 0) {
      throw new BadRequestError(
        `La cuenta "${c.cuenta}" debe tener al menos un movimiento registrado.`
      );
    }

    let acumuladoDebe = 0;
    let acumuladoHaber = 0;

    for (const m of c.movimientos) {
      const nroFila = c.movimientos.indexOf(m) + 1;

      // Debe haber al menos un importe > 0
      if (m.debe === 0 && m.haber === 0) {
        throw new BadRequestError(
          `En la cuenta "${c.cuenta}", el movimiento N° ${nroFila} debe tener un importe mayor a cero al Debe o al Haber.`
        );
      }

      // Exclusión Debe / Haber en la misma fila
      if (m.debe > 0 && m.haber > 0) {
        throw new BadRequestError(
          `En la cuenta "${c.cuenta}", el movimiento N° ${nroFila} no puede tener importe al Debe ($ ${m.debe}) y al Haber ($ ${m.haber}) simultáneamente.`
        );
      }

      acumuladoDebe += m.debe || 0;
      acumuladoHaber += m.haber || 0;
      const saldoFilaCalculado = Number(Math.abs(acumuladoDebe - acumuladoHaber).toFixed(2));

      // Saldo acumulado por renglón coincidente con el cálculo progresivo
      if (Math.abs(m.saldo - saldoFilaCalculado) > 0.01) {
        throw new BadRequestError(
          `En la cuenta "${c.cuenta}", el movimiento N° ${nroFila} tiene un saldo de $ ${m.saldo}, pero el saldo acumulado calculado es $ ${saldoFilaCalculado}.`
        );
      }
    }

    // 4. Tipo de saldo obligatorio
    if (!c.tipoSaldo) {
      throw new BadRequestError(
        `Debe indicar el tipo de saldo (DEUDOR o ACREEDOR) para la cuenta "${c.cuenta}".`
      );
    }

    // 5. Coherencia contable del saldo
    const { totalDebe, totalHaber, saldoCalculado } = calcularTotalesCuentaMayor(c.movimientos);

    // Si saldoCalculado > 0, validar tipo de saldo estrictamente
    // Si saldoCalculado === 0 (totalDebe === totalHaber), se acepta tanto DEUDOR como ACREEDOR
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
    }

    // 6. Saldo final obligatorio y coincidente con el cálculo
    if (Math.abs(c.saldoFinal - saldoCalculado) > 0.01) {
      throw new BadRequestError(
        `El saldo final de la cuenta "${c.cuenta}" ($ ${c.saldoFinal}) no coincide con el saldo calculado ($ ${saldoCalculado}).`
      );
    }
  }
}
