import type { ComprobanteIva, ContenidoLibroIva, TipoResultadoIva } from '../types/ejercicio.types';

export interface ErrorValidacionLibroIva {
  seccion?: 'COMPRA' | 'VENTA';
  comprobante?: number;
  mensaje: string;
}

const TOLERANCIA = 0.01;

function redondearImporte(valor: number): number {
  return Number(valor.toFixed(2));
}

function validarComprobante(
  comprobante: ComprobanteIva,
  tipo: 'COMPRA' | 'VENTA',
  indice: number
): ErrorValidacionLibroIva[] {
  const errores: ErrorValidacionLibroIva[] = [];

  const referencia = indice + 1;

  if (!comprobante.fecha.trim()) {
    errores.push({
      seccion: tipo,
      comprobante: referencia,
      mensaje: 'La fecha es obligatoria.',
    });
  }

  if (!Number.isInteger(comprobante.comprobante) || comprobante.comprobante <= 0) {
    errores.push({
      seccion: tipo,
      comprobante: referencia,
      mensaje: 'El número de comprobante debe ser un número entero mayor a cero.',
    });
  }

  if (!comprobante.nombre.trim()) {
    errores.push({
      seccion: tipo,
      comprobante: referencia,
      mensaje:
        tipo === 'COMPRA'
          ? 'El nombre del proveedor es obligatorio.'
          : 'El nombre del comprador es obligatorio.',
    });
  }

  if (!Number.isFinite(comprobante.netoGravado) || comprobante.netoGravado <= 0) {
    errores.push({
      seccion: tipo,
      comprobante: referencia,
      mensaje: 'El importe neto gravado debe ser mayor a cero.',
    });
  }

  if (!Number.isFinite(comprobante.iva) || comprobante.iva <= 0) {
    errores.push({
      seccion: tipo,
      comprobante: referencia,
      mensaje: 'El importe de IVA debe ser mayor a cero.',
    });
  }

  if (!Number.isFinite(comprobante.total) || comprobante.total <= 0) {
    errores.push({
      seccion: tipo,
      comprobante: referencia,
      mensaje: 'El importe total debe ser mayor a cero.',
    });
  }

  if (comprobante.netoGravado > 0 && comprobante.iva > 0 && comprobante.total > 0) {
    const totalCalculado = redondearImporte(comprobante.netoGravado + comprobante.iva);

    if (Math.abs(totalCalculado - comprobante.total) > TOLERANCIA) {
      errores.push({
        seccion: tipo,
        comprobante: referencia,
        mensaje: `El total ($ ${comprobante.total}) no coincide con Neto ($ ${comprobante.netoGravado}) + IVA ($ ${comprobante.iva}).`,
      });
    }
  }

  return errores;
}

function calcularResultadoEsperado(contenido: ContenidoLibroIva): {
  creditoFiscal: number;
  debitoFiscal: number;
  saldoIva: number;
  resultado: TipoResultadoIva;
} {
  const creditoFiscal = redondearImporte(
    contenido.compras.reduce((total, comprobante) => total + (comprobante.iva || 0), 0)
  );

  const debitoFiscal = redondearImporte(
    contenido.ventas.reduce((total, comprobante) => total + (comprobante.iva || 0), 0)
  );

  const diferencia = redondearImporte(debitoFiscal - creditoFiscal);

  return {
    creditoFiscal,
    debitoFiscal,
    saldoIva: Math.abs(diferencia),
    resultado: diferencia > 0 ? 'A_PAGAR' : 'A_FAVOR_CONTRIBUYENTE',
  };
}

function obtenerNombreResultado(resultado: TipoResultadoIva): string {
  return resultado === 'A_PAGAR' ? 'A pagar' : 'A favor del contribuyente';
}

export function validarLibroIvaResuelto(contenido: ContenidoLibroIva): ErrorValidacionLibroIva[] {
  const errores: ErrorValidacionLibroIva[] = [];

  // 1. Debe existir al menos un comprobante.
  if (contenido.compras.length === 0 && contenido.ventas.length === 0) {
    errores.push({
      mensaje: 'Debe registrar al menos un comprobante de compra o venta.',
    });

    return errores;
  }

  // 2. Validar comprobantes de compras.
  contenido.compras.forEach((comprobante, indice) => {
    errores.push(...validarComprobante(comprobante, 'COMPRA', indice));
  });

  // 3. Validar comprobantes de ventas.
  contenido.ventas.forEach((comprobante, indice) => {
    errores.push(...validarComprobante(comprobante, 'VENTA', indice));
  });

  // Si los comprobantes ya tienen errores, evitamos mostrar
  // errores derivados de una liquidación todavía incompleta.
  if (errores.length > 0) {
    return errores;
  }

  // 4. Resultado obligatorio.
  if (!contenido.resultado) {
    errores.push({
      mensaje: 'Debe seleccionar el resultado de la liquidación de IVA.',
    });

    return errores;
  }

  // 5. Calcular Crédito Fiscal, Débito Fiscal y resultado.
  const liquidacion = calcularResultadoEsperado(contenido);

  if (liquidacion.creditoFiscal === 0 && liquidacion.debitoFiscal === 0) {
    errores.push({
      mensaje: 'Debe registrar al menos un comprobante con importe de IVA mayor a cero.',
    });

    return errores;
  }

  // 6. Validar que el resultado elegido sea contablemente correcto.
  // Igual que el backend, si el saldo es cero no exigimos un resultado
  // específico entre las dos opciones disponibles.
  if (liquidacion.saldoIva > 0 && contenido.resultado !== liquidacion.resultado) {
    errores.push({
      mensaje: `El resultado seleccionado es incorrecto. Con un IVA Débito Fiscal de $ ${liquidacion.debitoFiscal} y un IVA Crédito Fiscal de $ ${liquidacion.creditoFiscal}, corresponde "${obtenerNombreResultado(
        liquidacion.resultado
      )}".`,
    });
  }

  return errores;
}
