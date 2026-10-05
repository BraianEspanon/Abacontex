import { z } from 'zod';
import { BadRequestError } from '../../errors/bad-request-error';
import { fechaContableObligatoriaSchema } from './fecha-contable.validator';

/* ==========================================================================
 * Plantilla: LIBRO IVA
 * ========================================================================== */

export const comprobanteIvaCompraSchema = z
  .object({
    fecha: fechaContableObligatoriaSchema,
    comprobante: z.string().trim().min(1, 'El número/tipo de comprobante es obligatorio.'),
    proveedor: z.string().trim().min(1, 'El nombre del proveedor es obligatorio.'),
    netoGravado: z.number().min(0, 'El importe neto gravado no puede ser negativo.'),
    iva: z.number().min(0, 'El importe de IVA Crédito Fiscal no puede ser negativo.'),
    total: z.number().min(0, 'El total facturado no puede ser negativo.'),
  })
  .strict();

export const comprobanteIvaVentaSchema = z
  .object({
    fecha: fechaContableObligatoriaSchema,
    comprobante: z.string().trim().min(1, 'El número/tipo de comprobante es obligatorio.'),
    comprador: z.string().trim().min(1, 'El nombre del comprador o cliente es obligatorio.'),
    netoGravado: z.number().min(0, 'El importe neto gravado no puede ser negativo.'),
    iva: z.number().min(0, 'El importe de IVA Débito Fiscal no puede ser negativo.'),
    total: z.number().min(0, 'El total facturado no puede ser negativo.'),
  })
  .strict();

export const libroIvaContenidoSchema = z
  .object({
    compras: z.array(comprobanteIvaCompraSchema).default([]),
    ventas: z.array(comprobanteIvaVentaSchema).default([]),
    totalIvaCreditoFiscal: z.number().min(0).optional().nullable(),
    totalIvaDebitoFiscal: z.number().min(0).optional().nullable(),
    saldoIva: z.number().optional().nullable(),
    tipoSaldo: z.enum(['A_FAVOR_CONTRIBUYENTE', 'A_PAGAR']).optional().nullable(),
  })
  .strict();

export type LibroIvaContenidoDTO = z.infer<typeof libroIvaContenidoSchema>;

export function validarBalanceLibroIva(contenido: unknown): void {
  const parsed = libroIvaContenidoSchema.safeParse(contenido);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Estructura de Libro IVA inválida.';
    throw new BadRequestError(errorMsg);
  }

  if (parsed.data.compras.length === 0 && parsed.data.ventas.length === 0) {
    throw new BadRequestError(
      'Para marcar el Libro IVA como RESUELTO debe registrar al menos un comprobante de compra o venta.'
    );
  }
}
