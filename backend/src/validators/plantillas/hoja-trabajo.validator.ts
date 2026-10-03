import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';

/* ==========================================================================
 * Plantilla: HOJA DE TRABAJO
 * ========================================================================== */

export const filaHojaTrabajoSchema = z
  .object({
    idCuenta: z
      .number({ message: 'El ID de la cuenta debe ser numérico.' })
      .int('El ID de la cuenta debe ser un número entero.')
      .positive('El ID de la cuenta debe ser mayor a cero.')
      .optional()
      .nullable(),
    cuenta: z.string().trim().min(1, 'El nombre de la cuenta es obligatorio.'),
    saldosSinAjustar: z
      .object({
        deudor: z.number().min(0).default(0),
        acreedor: z.number().min(0).default(0),
      })
      .strict()
      .optional(),
    ajustes: z
      .object({
        debe: z.number().min(0).default(0),
        haber: z.number().min(0).default(0),
      })
      .strict()
      .optional(),
    saldosAjustados: z
      .object({
        deudor: z.number().min(0).default(0),
        acreedor: z.number().min(0).default(0),
      })
      .strict()
      .optional(),
    estadoPatrimonial: z
      .object({
        activo: z.number().min(0).default(0),
        pasivoMasPn: z.number().min(0).default(0),
      })
      .strict()
      .optional(),
    estadoResultados: z
      .object({
        negativo: z.number().min(0).default(0),
        positivo: z.number().min(0).default(0),
      })
      .strict()
      .optional(),
  })
  .strict();

export const hojaTrabajoContenidoSchema = z
  .object({
    filas: z.array(filaHojaTrabajoSchema).default([]),
    resultadoEjercicio: z.number().optional().nullable(),
  })
  .strict();

export type HojaTrabajoContenidoDTO = z.infer<typeof hojaTrabajoContenidoSchema>;

export function validarBalanceHojaTrabajo(contenido: unknown): void {
  const parsed = hojaTrabajoContenidoSchema.safeParse(contenido);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Estructura de Hoja de Trabajo inválida.';
    throw new BadRequestError(errorMsg);
  }

  if (parsed.data.filas.length === 0) {
    throw new BadRequestError(
      'Para marcar la Hoja de Trabajo como RESUELTO debe registrar al menos una fila contable.'
    );
  }

  for (const f of parsed.data.filas) {
    if (!f.idCuenta) {
      throw new BadRequestError(
        `Debe seleccionar una cuenta contable válida para la fila "${f.cuenta}".`
      );
    }
  }
}
