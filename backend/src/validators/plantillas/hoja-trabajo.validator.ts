import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';

/* ==========================================================================
 * Plantilla: HOJA DE TRABAJO (Balance de 10 columnas)
 * ========================================================================== */

/**
 * Normaliza celdas numéricas de importe contable.
 * Admite importes numéricos >= 0, null o undefined (celdas vacías representadas con guión '-')
 * transformándolos consistentemente a 0.
 */
export const celdaImporteSchema = z.preprocess(
  (val) => (val === null || val === undefined || val === '' ? 0 : val),
  z.number().min(0, 'El importe contable no puede ser negativo.').default(0)
);

export const parSaldosSchema = z
  .object({
    deudor: celdaImporteSchema,
    acreedor: celdaImporteSchema,
  })
  .strict()
  .default({ deudor: 0, acreedor: 0 });

export const parAjustesSchema = z
  .object({
    debe: celdaImporteSchema,
    haber: celdaImporteSchema,
  })
  .strict()
  .default({ debe: 0, haber: 0 });

export const parSaldosAjustadosSchema = z
  .object({
    deudor: celdaImporteSchema,
    acreedor: celdaImporteSchema,
  })
  .strict()
  .default({ deudor: 0, acreedor: 0 });

export const parPatrimonialSchema = z
  .object({
    activo: celdaImporteSchema,
    pasivoMasPn: celdaImporteSchema,
  })
  .strict()
  .default({ activo: 0, pasivoMasPn: 0 });

export const parResultadosSchema = z
  .object({
    negativo: celdaImporteSchema,
    positivo: celdaImporteSchema,
  })
  .strict()
  .default({ negativo: 0, positivo: 0 });

export const filaHojaTrabajoSchema = z
  .object({
    idCuenta: z
      .number({ message: 'El ID de la cuenta debe ser numérico.' })
      .int('El ID de la cuenta debe ser un número entero.')
      .positive('Debe seleccionar una cuenta contable válida.'),
    cuenta: z
      .string({ message: 'La cuenta es obligatoria.' })
      .trim()
      .min(1, 'La cuenta no puede estar vacía.'),
    saldosSinAjustar: parSaldosSchema,
    ajustes: parAjustesSchema,
    saldosAjustados: parSaldosAjustadosSchema,
    estadoPatrimonial: parPatrimonialSchema,
    estadoResultados: parResultadosSchema,
  })
  .strict();

export type FilaHojaTrabajoDTO = z.infer<typeof filaHojaTrabajoSchema>;

export const hojaTrabajoContenidoSchema = z
  .object({
    filas: z.array(filaHojaTrabajoSchema).default([]),
  })
  .strict();

export type HojaTrabajoContenidoDTO = z.infer<typeof hojaTrabajoContenidoSchema>;

/**
 * Función utilitaria para calcular dinámicamente los totales de cada columna
 * a partir de las filas registradas.
 */
export function calcularTotalesHojaTrabajo(filas: FilaHojaTrabajoDTO[]) {
  return filas.reduce(
    (acc, f) => ({
      saldosSinAjustar: {
        deudor: Number((acc.saldosSinAjustar.deudor + f.saldosSinAjustar.deudor).toFixed(2)),
        acreedor: Number((acc.saldosSinAjustar.acreedor + f.saldosSinAjustar.acreedor).toFixed(2)),
      },
      ajustes: {
        debe: Number((acc.ajustes.debe + f.ajustes.debe).toFixed(2)),
        haber: Number((acc.ajustes.haber + f.ajustes.haber).toFixed(2)),
      },
      saldosAjustados: {
        deudor: Number((acc.saldosAjustados.deudor + f.saldosAjustados.deudor).toFixed(2)),
        acreedor: Number((acc.saldosAjustados.acreedor + f.saldosAjustados.acreedor).toFixed(2)),
      },
      estadoPatrimonial: {
        activo: Number((acc.estadoPatrimonial.activo + f.estadoPatrimonial.activo).toFixed(2)),
        pasivoMasPn: Number(
          (acc.estadoPatrimonial.pasivoMasPn + f.estadoPatrimonial.pasivoMasPn).toFixed(2)
        ),
      },
      estadoResultados: {
        negativo: Number((acc.estadoResultados.negativo + f.estadoResultados.negativo).toFixed(2)),
        positivo: Number((acc.estadoResultados.positivo + f.estadoResultados.positivo).toFixed(2)),
      },
    }),
    {
      saldosSinAjustar: { deudor: 0, acreedor: 0 },
      ajustes: { debe: 0, haber: 0 },
      saldosAjustados: { deudor: 0, acreedor: 0 },
      estadoPatrimonial: { activo: 0, pasivoMasPn: 0 },
      estadoResultados: { negativo: 0, positivo: 0 },
    }
  );
}

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

  const idsCuentas = new Set<number>();
  const nombresCuentas = new Set<string>();

  for (const f of parsed.data.filas) {
    const nombreNormalizado = f.cuenta.trim().toLowerCase();

    // 1. Cuentas únicas
    if (idsCuentas.has(f.idCuenta) || nombresCuentas.has(nombreNormalizado)) {
      throw new BadRequestError(
        `La cuenta "${f.cuenta}" está repetida. Cada cuenta contable debe registrarse en una única fila de la Hoja de Trabajo.`
      );
    }
    
    idsCuentas.add(f.idCuenta);
    nombresCuentas.add(nombreNormalizado);

    // 2. Exclusión de saldos por fila (Saldos sin ajustar)
    if (f.saldosSinAjustar.deudor > 0 && f.saldosSinAjustar.acreedor > 0) {
      throw new BadRequestError(
        `La cuenta "${f.cuenta}" no puede tener saldo Deudor y Acreedor simultáneamente en Saldos sin ajustar.`
      );
    }

    // 3. Exclusión de saldos por fila (Saldos ajustados)
    if (f.saldosAjustados.deudor > 0 && f.saldosAjustados.acreedor > 0) {
      throw new BadRequestError(
        `La cuenta "${f.cuenta}" no puede tener saldo Deudor y Acreedor simultáneamente en Saldos ajustados.`
      );
    }

    // 4. Exclusión entre Estado Patrimonial y Estado de Resultados
    const tienePatrimonial = f.estadoPatrimonial.activo > 0 || f.estadoPatrimonial.pasivoMasPn > 0;
    const tieneResultados = f.estadoResultados.negativo > 0 || f.estadoResultados.positivo > 0;
    if (tienePatrimonial && tieneResultados) {
      throw new BadRequestError(
        `La cuenta "${f.cuenta}" no puede trasladarse al Estado Patrimonial y al Estado de Resultados simultáneamente.`
      );
    }

    // 5. Exclusión interna en Estado Patrimonial (Activo vs Pasivo + PN)
    if (f.estadoPatrimonial.activo > 0 && f.estadoPatrimonial.pasivoMasPn > 0) {
      throw new BadRequestError(
        `La cuenta "${f.cuenta}" no puede tener importe en Activo y Pasivo + PN simultáneamente.`
      );
    }

    // 6. Exclusión interna en Estado de Resultados (Negativo vs Positivo)
    if (f.estadoResultados.negativo > 0 && f.estadoResultados.positivo > 0) {
      throw new BadRequestError(
        `La cuenta "${f.cuenta}" no puede tener importe en Resultados Negativo y Positivo simultáneamente.`
      );
    }
  }

  // 7. Balances por pares de columnas (Sumas Iguales)
  const totales = calcularTotalesHojaTrabajo(parsed.data.filas);

  if (Math.abs(totales.saldosSinAjustar.deudor - totales.saldosSinAjustar.acreedor) > 0.01) {
    throw new BadRequestError(
      `La columna de Saldos sin ajustar está desbalanceada (Total Deudor: $ ${totales.saldosSinAjustar.deudor}, Total Acreedor: $ ${totales.saldosSinAjustar.acreedor}).`
    );
  }

  if (Math.abs(totales.ajustes.debe - totales.ajustes.haber) > 0.01) {
    throw new BadRequestError(
      `La columna de Ajustes está desbalanceada (Total Debe: $ ${totales.ajustes.debe}, Total Haber: $ ${totales.ajustes.haber}).`
    );
  }

  if (Math.abs(totales.saldosAjustados.deudor - totales.saldosAjustados.acreedor) > 0.01) {
    throw new BadRequestError(
      `La columna de Saldos ajustados está desbalanceada (Total Deudor: $ ${totales.saldosAjustados.deudor}, Total Acreedor: $ ${totales.saldosAjustados.acreedor}).`
    );
  }
}
