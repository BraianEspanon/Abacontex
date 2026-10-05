import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';
import { fechaContableOpcionalSchema } from './fecha-contable.validator';

/* ==========================================================================
 * Plantilla: LIBRO MAYOR
 * ========================================================================== */

export const movimientoMayorSchema = z
  .object({
    fecha: fechaContableOpcionalSchema,
    concepto: z.string().trim().default(''),
    debe: z.number().min(0, 'El importe al Debe no puede ser negativo.').default(0),
    haber: z.number().min(0, 'El importe al Haber no puede ser negativo.').default(0),
    saldo: z.number().optional().nullable(),
  })
  .strict();

export const cuentaMayorSchema = z
  .object({
    idCuenta: z
      .number('El ID de la cuenta debe ser numérico.')
      .int('El ID de la cuenta debe ser un número entero.')
      .positive('El ID de la cuenta debe ser mayor a cero.')
      .optional()
      .nullable(),
    cuenta: z.string().trim().min(1, 'El nombre de la cuenta no puede estar vacío.'),
    movimientos: z.array(movimientoMayorSchema).default([]),
    saldoFinal: z.number().optional().nullable(),
    tipoSaldo: z.enum(['DEUDOR', 'ACREEDOR']).optional().nullable(),
  })
  .strict();

export const libroMayorContenidoSchema = z
  .object({
    cuentas: z.array(cuentaMayorSchema).default([]),
  })
  .strict();

export type LibroMayorContenidoDTO = z.infer<typeof libroMayorContenidoSchema>;

export function validarBalanceLibroMayor(contenido: unknown): void {
  const parsed = libroMayorContenidoSchema.safeParse(contenido);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Estructura de Libro Mayor inválida.';
    throw new BadRequestError(errorMsg);
  }

  if (parsed.data.cuentas.length === 0) {
    throw new BadRequestError(
      'Para marcar el Libro Mayor como RESUELTO debe registrar al menos una cuenta mayorizada.'
    );
  }

  for (const c of parsed.data.cuentas) {
    if (!c.idCuenta) {
      throw new BadRequestError(
        `Debe seleccionar una cuenta contable válida para la cuenta "${c.cuenta}".`
      );
    }
    if (c.movimientos.length === 0) {
      throw new BadRequestError(
        `La cuenta "${c.cuenta}" debe tener al menos un movimiento registrado.`
      );
    }
    if (!c.tipoSaldo) {
      throw new BadRequestError(
        `Debe indicar el tipo de saldo (DEUDOR o ACREEDOR) para la cuenta "${c.cuenta}".`
      );
    }
  }
}
