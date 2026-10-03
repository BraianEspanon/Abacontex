import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';
import { MAPA_TIPOS_MOVIMIENTO } from '../../constants/asiento.constants';
import { fechaContableObligatoriaSchema } from './fecha-contable.validator';

export const SIMBOLOS_MOVIMIENTO = Object.values(MAPA_TIPOS_MOVIMIENTO).map(
  (info) => info.simbolo
) as [string, ...string[]];

export const movimientoContableObligatorioSchema = z.enum(SIMBOLOS_MOVIMIENTO, {
  message: `Debe seleccionar un tipo de movimiento válido (${SIMBOLOS_MOVIMIENTO.join(', ')}).`,
});

/* ==========================================================================
 * Plantilla: LIBRO DIARIO
 * ========================================================================== */

export const asientoLineaSchema = z
  .object({
    idCuenta: z
      .number({ message: 'El ID de la cuenta debe ser numérico.' })
      .int('El ID de la cuenta debe ser un número entero.')
      .positive('Debe seleccionar una cuenta contable válida.'),
    cuenta: z
      .string({ message: 'La cuenta es obligatoria.' })
      .trim()
      .min(1, 'La cuenta no puede estar vacía.'),
    movimiento: movimientoContableObligatorioSchema,
    folio: z.number().int().positive('El folio debe ser un entero positivo.').optional().nullable(),
    debe: z.number().min(0, 'El importe al Debe no puede ser negativo.').default(0),
    haber: z.number().min(0, 'El importe al Haber no puede ser negativo.').default(0),
  })
  .strict();

export const asientoSchema = z
  .object({
    numero: z.number().int().positive('El número de asiento debe ser un entero positivo.'),
    fecha: fechaContableObligatoriaSchema,
    concepto: z.string().trim().default(''),
    lineas: z.array(asientoLineaSchema).default([]),
  })
  .strict();

export const libroDiarioContenidoSchema = z
  .object({
    asientos: z.array(asientoSchema).default([]),
  })
  .strict();

export type LibroDiarioContenidoDTO = z.infer<typeof libroDiarioContenidoSchema>;

export function validarBalanceLibroDiario(contenido: unknown): void {
  const parsed = libroDiarioContenidoSchema.safeParse(contenido);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Estructura de Libro Diario inválida.';
    throw new BadRequestError(errorMsg);
  }

  if (parsed.data.asientos.length === 0) {
    throw new BadRequestError(
      'Para marcar el Libro Diario como RESUELTO debe registrar al menos un asiento contable.'
    );
  }

  const numerosAsiento = new Set<number>();

  for (const asiento of parsed.data.asientos) {
    if (numerosAsiento.has(asiento.numero)) {
      throw new BadRequestError(
        `Existen múltiples asientos con el N° ${asiento.numero}. Los números de asiento deben ser únicos.`
      );
    }
    numerosAsiento.add(asiento.numero);

    for (const linea of asiento.lineas) {
      if (linea.debe === 0 && linea.haber === 0) {
        throw new BadRequestError(
          `El asiento N° ${asiento.numero} contiene líneas sin importe cargado en el Debe ni en el Haber.`
        );
      }
      if (linea.debe > 0 && linea.haber > 0) {
        throw new BadRequestError(
          `El asiento N° ${asiento.numero} contiene líneas con importe simultáneo en Debe y Haber ($ ${linea.debe} y $ ${linea.haber}).`
        );
      }
    }

    const totalDebe = Number(asiento.lineas.reduce((acc, l) => acc + (l.debe || 0), 0).toFixed(2));
    const totalHaber = Number(
      asiento.lineas.reduce((acc, l) => acc + (l.haber || 0), 0).toFixed(2)
    );

    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      throw new BadRequestError(
        `El asiento N° ${asiento.numero} está desbalanceado (Total Debe: $ ${totalDebe}, Total Haber: $ ${totalHaber}).`
      );
    }
  }
}
