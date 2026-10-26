import { ErrorDetalleItemDTO } from '../../dto/correccion/correccion.dto';
import { ResultadoComparacionPlantilla } from './types';

interface LineaDiarioRaw {
  idCuenta?: number;
  cuenta?: string;
  movimiento?: string;
  folio?: number | null;
  debe?: number;
  haber?: number;
}

interface AsientoDiarioRaw {
  numero: number;
  fecha?: unknown;
  concepto?: string;
  lineas?: LineaDiarioRaw[];
}

export function compararLibroDiario(
  plantillaId: number,
  contenidoDocente: unknown,
  contenidoAlumno: unknown
): ResultadoComparacionPlantilla {
  const errores: ErrorDetalleItemDTO[] = [];
  let aciertos = 0;
  let diferenciasDetectadas = 0;
  let asientosIncompletos = 0;

  const doc = (contenidoDocente as { asientos?: AsientoDiarioRaw[] })?.asientos || [];
  const alu = (contenidoAlumno as { asientos?: AsientoDiarioRaw[] })?.asientos || [];

  const mapaAlu = new Map<number, AsientoDiarioRaw>();
  for (const a of alu) {
    mapaAlu.set(a.numero, a);
  }

  for (const asDoc of doc) {
    const asAlu = mapaAlu.get(asDoc.numero);

    if (!asAlu) {
      asientosIncompletos++;
      for (const lDoc of asDoc.lineas || []) {
        errores.push({
          idError: null,
          ejercicioPlantillaId: plantillaId,
          tipoError: 'CUENTA_OMITIDA',
          detalle: {
            numeroAsiento: asDoc.numero,
            idCuenta: lDoc.idCuenta,
            cuenta: lDoc.cuenta,
            celda: 'cuenta',
            motivo: `El asiento N° ${asDoc.numero} fue omitido por el alumno.`,
          },
          comentarioDocente: null,
        });
      }
      continue;
    }

    // Verificar balance del asiento del alumno
    const lineasAlu = asAlu.lineas || [];
    const totalDebe = Number(lineasAlu.reduce((acc, l) => acc + (l.debe || 0), 0).toFixed(2));
    const totalHaber = Number(lineasAlu.reduce((acc, l) => acc + (l.haber || 0), 0).toFixed(2));

    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      asientosIncompletos++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'IMPORTE_INCORRECTO',
        detalle: {
          numeroAsiento: asDoc.numero,
          celda: 'balance',
          esperado: 'Asiento balanceado',
          obtenido: `Debe: $ ${totalDebe} vs Haber: $ ${totalHaber}`,
          motivo: `El asiento N° ${asDoc.numero} se encuentra desbalanceado.`,
        },
        comentarioDocente: null,
      });
    }

    // Comparar líneas del asiento
    const lineasDoc = asDoc.lineas || [];
    const aluLineasRestantes = [...lineasAlu];

    for (const lDoc of lineasDoc) {
      // Intentar coincidir por idCuenta
      const idxAlu = aluLineasRestantes.findIndex((l) => l.idCuenta === lDoc.idCuenta);

      if (idxAlu === -1) {
        // Si hay una línea del alumno en esa misma posición, es cuenta incorrecta
        if (aluLineasRestantes.length > 0) {
          const lAlu = aluLineasRestantes.shift()!;
          diferenciasDetectadas++;
          errores.push({
            idError: null,
            ejercicioPlantillaId: plantillaId,
            tipoError: 'CUENTA_INCORRECTA',
            detalle: {
              numeroAsiento: asDoc.numero,
              idCuenta: lAlu.idCuenta,
              cuenta: lAlu.cuenta,
              celda: 'cuenta',
              esperado: lDoc.cuenta,
              obtenido: lAlu.cuenta,
              motivo: `Se esperaba la cuenta "${lDoc.cuenta}" pero se utilizó "${lAlu.cuenta}".`,
            },
            comentarioDocente: null,
          });

          // Evaluar también variación patrimonial e importes de la línea sustituta
          const resDetalle = compararDetalleLineaDiario(
            asDoc.numero,
            lDoc,
            lAlu,
            plantillaId,
            errores,
            true
          );
          diferenciasDetectadas += resDetalle.diferencias;
          aciertos += resDetalle.aciertos;
        } else {
          asientosIncompletos++;
          errores.push({
            idError: null,
            ejercicioPlantillaId: plantillaId,
            tipoError: 'CUENTA_OMITIDA',
            detalle: {
              numeroAsiento: asDoc.numero,
              idCuenta: lDoc.idCuenta,
              cuenta: lDoc.cuenta,
              celda: 'cuenta',
              motivo: `Falta registrar la cuenta "${lDoc.cuenta}" en el asiento N° ${asDoc.numero}.`,
            },
            comentarioDocente: null,
          });
        }
        continue;
      }

      const lAlu = aluLineasRestantes.splice(idxAlu, 1)[0];
      if (!lAlu) {
        continue;
      }

      // Cuenta correcta -> +1 acierto
      aciertos++;

      // Evaluar variación patrimonial e importes de la línea
      const resDetalle = compararDetalleLineaDiario(
        asDoc.numero,
        lDoc,
        lAlu,
        plantillaId,
        errores,
        false
      );
      diferenciasDetectadas += resDetalle.diferencias;
      aciertos += resDetalle.aciertos;
    }

    // Líneas adicionales sobrantes en el asiento del alumno
    for (const extra of aluLineasRestantes) {
      diferenciasDetectadas++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'CUENTA_ADICIONAL',
        detalle: {
          numeroAsiento: asDoc.numero,
          idCuenta: extra.idCuenta,
          cuenta: extra.cuenta,
          celda: 'cuenta',
          motivo: `Cuenta adicional "${extra.cuenta}" no contemplada en la solución modelo.`,
        },
        comentarioDocente: null,
      });
    }
  }

  return { errores, aciertos, diferenciasDetectadas, asientosIncompletos };
}

/**
 * Compara la variación patrimonial y el importe (Debe/Haber) de una línea de asiento.
 */
function compararDetalleLineaDiario(
  numeroAsiento: number,
  lDoc: LineaDiarioRaw,
  lAlu: LineaDiarioRaw,
  plantillaId: number,
  errores: ErrorDetalleItemDTO[],
  esSustituta: boolean = false
): { diferencias: number; aciertos: number } {
  let diferencias = 0;
  let aciertos = 0;

  // 1. Tipo de movimiento / Variación patrimonial
  if (lDoc.movimiento) {
    if (!lAlu.movimiento || lDoc.movimiento !== lAlu.movimiento) {
      diferencias++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'TIPO_MOVIMIENTO_INCORRECTO',
        detalle: {
          numeroAsiento,
          idCuenta: lAlu.idCuenta,
          cuenta: lAlu.cuenta,
          celda: 'movimiento',
          esperado: lDoc.movimiento,
          obtenido: lAlu.movimiento || null,
          motivo: esSustituta
            ? `Variación patrimonial incorrecta en "${lAlu.cuenta}" respecto a la esperada "${lDoc.cuenta}".`
            : `Variación patrimonial incorrecta en "${lDoc.cuenta}".`,
        },
        comentarioDocente: null,
      });
    } else {
      aciertos++;
    }
  }

  // 2. Debe y Haber invertidos / Importe
  const docDebe = lDoc.debe || 0;
  const docHaber = lDoc.haber || 0;
  const aluDebe = lAlu.debe || 0;
  const aluHaber = lAlu.haber || 0;

  if (docDebe > 0 && docHaber === 0 && aluDebe === 0 && aluHaber > 0) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'DEBE_HABER_INVERTIDO',
      detalle: {
        numeroAsiento,
        idCuenta: lAlu.idCuenta,
        cuenta: lAlu.cuenta,
        celda: 'debe_haber',
        esperado: { debe: docDebe, haber: docHaber },
        obtenido: { debe: aluDebe, haber: aluHaber },
        motivo: `El importe de "${lAlu.cuenta}" se acreditó en lugar de debitarse.`,
      },
      comentarioDocente: null,
    });
  } else if (docHaber > 0 && docDebe === 0 && aluHaber === 0 && aluDebe > 0) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'DEBE_HABER_INVERTIDO',
      detalle: {
        numeroAsiento,
        idCuenta: lAlu.idCuenta,
        cuenta: lAlu.cuenta,
        celda: 'debe_haber',
        esperado: { debe: docDebe, haber: docHaber },
        obtenido: { debe: aluDebe, haber: aluHaber },
        motivo: `El importe de "${lAlu.cuenta}" se debitó en lugar de acreditarse.`,
      },
      comentarioDocente: null,
    });
  } else if (Math.abs(docDebe - aluDebe) > 0.01 || Math.abs(docHaber - aluHaber) > 0.01) {
    diferencias++;

    const difDebe = Math.abs(docDebe - aluDebe) > 0.01;
    const difHaber = Math.abs(docHaber - aluHaber) > 0.01;

    let celda: string;
    let esperado: unknown;
    let obtenido: unknown;
    let motivo: string;

    if (difDebe && !difHaber) {
      celda = 'debe';
      esperado = docDebe;
      obtenido = aluDebe;
      motivo = esSustituta
        ? `Importe en el Debe de "${lAlu.cuenta}" incorrecto respecto a la cuenta esperada "${lDoc.cuenta}" (obtenido $ ${aluDebe}, esperado $ ${docDebe}).`
        : `Importe en el Debe de "${lDoc.cuenta}" incorrecto (obtenido $ ${aluDebe}, esperado $ ${docDebe}).`;
    } else if (difHaber && !difDebe) {
      celda = 'haber';
      esperado = docHaber;
      obtenido = aluHaber;
      motivo = esSustituta
        ? `Importe en el Haber de "${lAlu.cuenta}" incorrecto respecto a la cuenta esperada "${lDoc.cuenta}" (obtenido $ ${aluHaber}, esperado $ ${docHaber}).`
        : docHaber === 0 && aluHaber > 0
          ? `Se registró indebidamente un crédito de $ ${aluHaber} en el Haber de "${lDoc.cuenta}" (esperado: $ 0).`
          : `Importe en el Haber de "${lDoc.cuenta}" incorrecto (obtenido $ ${aluHaber}, esperado $ ${docHaber}).`;
    } else {
      celda = 'debe_haber';
      esperado = { debe: docDebe, haber: docHaber };
      obtenido = { debe: aluDebe, haber: aluHaber };
      motivo = esSustituta
        ? `Importes de Debe y Haber en "${lAlu.cuenta}" incorrectos respecto a la cuenta esperada "${lDoc.cuenta}".`
        : `Importes de Debe y Haber incorrectos en "${lDoc.cuenta}".`;
    }

    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'IMPORTE_INCORRECTO',
      detalle: {
        numeroAsiento,
        idCuenta: lAlu.idCuenta,
        cuenta: lAlu.cuenta,
        celda,
        esperado,
        obtenido,
        motivo,
      },
      comentarioDocente: null,
    });
  } else {
    aciertos++;
  }

  return { diferencias, aciertos };
}
