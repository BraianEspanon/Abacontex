import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';
import { fechaContableObligatoriaSchema } from './fecha-contable.validator';

/* ==========================================================================
 * Plantilla: LIBRO IVA (Compras y Ventas)
 * ========================================================================== */

export const comprobanteIvaSchema = z
  .object({
    fecha: fechaContableObligatoriaSchema,
    comprobante: z
      .number('El número de comprobante es obligatorio y debe ser numérico.')
      .int('El número de comprobante debe ser un número entero.')
      .positive('El número de comprobante debe ser mayor a cero.'),
    nombre: z
      .string('El nombre del proveedor o comprador es obligatorio.')
      .trim()
      .min(1, 'El nombre no puede estar vacío.'),
    netoGravado: z
      .number('El importe neto gravado debe ser numérico.')
      .min(0, 'El importe neto gravado no puede ser negativo.')
      .default(0),
    iva: z
      .number('El importe de IVA debe ser numérico.')
      .min(0, 'El importe de IVA no puede ser negativo.')
      .default(0),
    total: z
      .number('El total facturado debe ser numérico.')
      .min(0, 'El total facturado no puede ser negativo.')
      .default(0),
  })
  .strict();

export type ComprobanteIvaDTO = z.infer<typeof comprobanteIvaSchema>;

export const TIPOS_RESULTADO_IVA = ['A_FAVOR_CONTRIBUYENTE', 'A_PAGAR'] as const;
export type TipoResultadoIva = (typeof TIPOS_RESULTADO_IVA)[number];

export const libroIvaContenidoSchema = z
  .object({
    compras: z.array(comprobanteIvaSchema).default([]),
    ventas: z.array(comprobanteIvaSchema).default([]),
    resultado: z.enum(TIPOS_RESULTADO_IVA).optional().nullable(),
  })
  .strict();

export type LibroIvaContenidoDTO = z.infer<typeof libroIvaContenidoSchema>;

export interface LiquidacionIvaDTO {
  totalNetoCompras: number;
  totalIvaCreditoFiscal: number;
  totalCompras: number;
  totalNetoVentas: number;
  totalIvaDebitoFiscal: number;
  totalVentas: number;
  saldoIva: number;
  resultadoCalculado: TipoResultadoIva;
}

/**
 * Función utilitaria para calcular la liquidación mensual de IVA
 * a partir de los comprobantes cargados en el Libro IVA.
 */
export function calcularLiquidacionIva(
  compras: ComprobanteIvaDTO[],
  ventas: ComprobanteIvaDTO[]
): LiquidacionIvaDTO {
  const totalNetoCompras = Number(
    compras.reduce((acc, c) => acc + (c.netoGravado || 0), 0).toFixed(2)
  );
  const totalIvaCreditoFiscal = Number(
    compras.reduce((acc, c) => acc + (c.iva || 0), 0).toFixed(2)
  );
  const totalCompras = Number(compras.reduce((acc, c) => acc + (c.total || 0), 0).toFixed(2));

  const totalNetoVentas = Number(
    ventas.reduce((acc, v) => acc + (v.netoGravado || 0), 0).toFixed(2)
  );
  const totalIvaDebitoFiscal = Number(ventas.reduce((acc, v) => acc + (v.iva || 0), 0).toFixed(2));
  const totalVentas = Number(ventas.reduce((acc, v) => acc + (v.total || 0), 0).toFixed(2));

  const diferencia = Number((totalIvaDebitoFiscal - totalIvaCreditoFiscal).toFixed(2));
  const saldoIva = Math.abs(diferencia);
  const resultadoCalculado: TipoResultadoIva = diferencia > 0 ? 'A_PAGAR' : 'A_FAVOR_CONTRIBUYENTE';

  return {
    totalNetoCompras,
    totalIvaCreditoFiscal,
    totalCompras,
    totalNetoVentas,
    totalIvaDebitoFiscal,
    totalVentas,
    saldoIva,
    resultadoCalculado,
  };
}

function validarComprobantes(comprobantes: ComprobanteIvaDTO[], tipo: 'compra' | 'venta'): void {
  for (const c of comprobantes) {
    if (c.netoGravado <= 0) {
      throw new BadRequestError(
        `El comprobante de ${tipo} N° ${c.comprobante} debe tener un importe neto gravado mayor a cero.`
      );
    }
    if (c.iva <= 0) {
      throw new BadRequestError(
        `El comprobante de ${tipo} N° ${c.comprobante} debe tener un importe de IVA mayor a cero.`
      );
    }
    if (c.total <= 0) {
      throw new BadRequestError(
        `El comprobante de ${tipo} N° ${c.comprobante} debe tener un importe total mayor a cero.`
      );
    }
    const sumaCalculada = Number((c.netoGravado + c.iva).toFixed(2));
    if (Math.abs(sumaCalculada - c.total) > 0.01) {
      throw new BadRequestError(
        `El total del comprobante de ${tipo} N° ${c.comprobante} ($ ${c.total}) no coincide con la suma de Neto ($ ${c.netoGravado}) + IVA ($ ${c.iva}).`
      );
    }
  }
}

export function validarBalanceLibroIva(contenido: unknown): void {
  const parsed = libroIvaContenidoSchema.safeParse(contenido);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Estructura de Libro IVA inválida.';
    throw new BadRequestError(errorMsg);
  }

  const { compras, ventas, resultado } = parsed.data;

  // 1. Al menos un comprobante registrado
  if (compras.length === 0 && ventas.length === 0) {
    throw new BadRequestError(
      'Para marcar el Libro IVA como RESUELTO debe registrar al menos un comprobante de compra o venta.'
    );
  }

  // 2. Consistencia en comprobantes de Compras y Ventas (neto > 0, iva > 0, total > 0 y neto + iva === total)
  validarComprobantes(compras, 'compra');
  validarComprobantes(ventas, 'venta');

  // 3. Resultado obligatorio
  if (!resultado) {
    throw new BadRequestError(
      'Debe seleccionar el resultado de la liquidación de IVA (A favor del contribuyente o A pagar).'
    );
  }

  // 4. Coherencia contable entre Débito Fiscal y Crédito Fiscal
  const liquidacion = calcularLiquidacionIva(compras, ventas);

  if (liquidacion.totalIvaDebitoFiscal === 0 && liquidacion.totalIvaCreditoFiscal === 0) {
    throw new BadRequestError(
      'Para marcar el Libro IVA como RESUELTO debe registrar al menos un comprobante con importe de IVA mayor a cero.'
    );
  }

  if (liquidacion.saldoIva > 0) {
    if (resultado !== liquidacion.resultadoCalculado) {
      const esperadoTxt =
        liquidacion.resultadoCalculado === 'A_PAGAR'
          ? 'IVA Saldo a Pagar (el Débito Fiscal supera al Crédito Fiscal)'
          : 'IVA Saldo a Favor del Contribuyente (el Crédito Fiscal supera al Débito Fiscal)';
      throw new BadRequestError(
        `El resultado seleccionado es incorrecto. De acuerdo a la liquidación calculada (Débito Fiscal: $ ${liquidacion.totalIvaDebitoFiscal}, Crédito Fiscal: $ ${liquidacion.totalIvaCreditoFiscal}), el resultado corresponde a: ${esperadoTxt}.`
      );
    }
  }
}
