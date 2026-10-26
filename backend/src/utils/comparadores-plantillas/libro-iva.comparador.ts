import { ErrorDetalleItemDTO } from '../../dto/correccion/correccion.dto';
import { ResultadoComparacionPlantilla } from './types';

interface ComprobanteIvaRaw {
  fecha?: { dia?: number; mes?: number };
  comprobante: number;
  nombre?: string;
  netoGravado?: number;
  iva?: number;
  total?: number;
}

export function compararLibroIva(
  plantillaId: number,
  contenidoDocente: unknown,
  contenidoAlumno: unknown
): ResultadoComparacionPlantilla {
  const errores: ErrorDetalleItemDTO[] = [];
  let aciertos = 0;
  let diferenciasDetectadas = 0;
  let asientosIncompletos = 0;

  const doc = contenidoDocente as {
    compras?: ComprobanteIvaRaw[];
    ventas?: ComprobanteIvaRaw[];
    resultado?: string | null;
  };
  const alu = contenidoAlumno as {
    compras?: ComprobanteIvaRaw[];
    ventas?: ComprobanteIvaRaw[];
    resultado?: string | null;
  };

  const secciones: Array<{
    nombre: 'Compras' | 'Ventas';
    doc: ComprobanteIvaRaw[];
    alu: ComprobanteIvaRaw[];
  }> = [
    { nombre: 'Compras', doc: doc?.compras || [], alu: alu?.compras || [] },
    { nombre: 'Ventas', doc: doc?.ventas || [], alu: alu?.ventas || [] },
  ];

  for (const sec of secciones) {
    const mapaAlu = new Map<number, ComprobanteIvaRaw>();
    for (const c of sec.alu) {
      mapaAlu.set(c.comprobante, c);
    }

    const comprobantesFaltantesDoc: ComprobanteIvaRaw[] = [];

    // 1. Emparejamiento directo por número de comprobante
    for (const cDoc of sec.doc) {
      const cAlu = mapaAlu.get(cDoc.comprobante);

      if (!cAlu) {
        comprobantesFaltantesDoc.push(cDoc);
        continue;
      }

      // Lugar 1: Número de comprobante correcto -> +1 acierto
      aciertos++;

      // Lugares 2, 3 y 4: Neto gravado, IVA y Total
      const resImp = compararImportesComprobante(
        sec.nombre,
        cDoc,
        cAlu,
        plantillaId,
        errores,
        false
      );
      diferenciasDetectadas += resImp.diferencias;
      aciertos += resImp.aciertos;
    }

    // Identificar comprobantes sobrantes del alumno en esta sección
    const setDoc = new Set(sec.doc.map((c) => c.comprobante));
    const comprobantesSobrantesAlu = sec.alu.filter((c) => !setDoc.has(c.comprobante));

    // 2. Desempate / sustitución de comprobantes
    if (comprobantesFaltantesDoc.length === 1 && comprobantesSobrantesAlu.length === 1) {
      const cDocUnico = comprobantesFaltantesDoc[0]!;
      const cAluUnico = comprobantesSobrantesAlu[0]!;

      // Discrepancia en el número de comprobante
      diferenciasDetectadas++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'COMPROBANTE_OMITIDO',
        detalle: {
          seccion: sec.nombre,
          comprobante: cDocUnico.comprobante,
          nombre: cDocUnico.nombre,
          celda: 'comprobante',
          esperado: cDocUnico.comprobante,
          obtenido: cAluUnico.comprobante,
          motivo: `En ${sec.nombre}, se esperaba registrar el comprobante N° ${cDocUnico.comprobante}, pero se cargó el comprobante N° ${cAluUnico.comprobante}.`,
        },
        comentarioDocente: null,
      });

      // Evaluar importes del comprobante sustituto contra los esperados
      const resImp = compararImportesComprobante(
        sec.nombre,
        cDocUnico,
        cAluUnico,
        plantillaId,
        errores,
        true
      );
      diferenciasDetectadas += resImp.diferencias;
      aciertos += resImp.aciertos;
    } else {
      // Casos múltiples o asimétricos
      for (const cDoc of comprobantesFaltantesDoc) {
        asientosIncompletos++;
        errores.push({
          idError: null,
          ejercicioPlantillaId: plantillaId,
          tipoError: 'COMPROBANTE_OMITIDO',
          detalle: {
            seccion: sec.nombre,
            comprobante: cDoc.comprobante,
            nombre: cDoc.nombre,
            celda: 'comprobante',
            motivo: `Comprobante N° ${cDoc.comprobante} omitido en Libro IVA ${sec.nombre}.`,
          },
          comentarioDocente: null,
        });
      }

      for (const cAlu of comprobantesSobrantesAlu) {
        diferenciasDetectadas++;
        errores.push({
          idError: null,
          ejercicioPlantillaId: plantillaId,
          tipoError: 'COMPROBANTE_ADICIONAL',
          detalle: {
            seccion: sec.nombre,
            comprobante: cAlu.comprobante,
            nombre: cAlu.nombre,
            celda: 'comprobante',
            motivo: `Comprobante N° ${cAlu.comprobante} adicional no solicitado en la consigna (${sec.nombre}).`,
          },
          comentarioDocente: null,
        });
      }
    }
  }

  // Comparar liquidación mensual / resultado
  if (doc?.resultado) {
    if (!alu?.resultado) {
      asientosIncompletos++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'CLASIFICACION_SALDO_INCORRECTA',
        detalle: {
          celda: 'resultado',
          esperado: doc.resultado,
          motivo: 'Falta determinar la liquidación mensual de IVA (saldo a pagar o a favor).',
        },
        comentarioDocente: null,
      });
    } else if (doc.resultado !== alu.resultado) {
      diferenciasDetectadas++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'CLASIFICACION_SALDO_INCORRECTA',
        detalle: {
          celda: 'resultado',
          esperado: doc.resultado,
          obtenido: alu.resultado,
          motivo: `La liquidación mensual de IVA fue catalogada como ${alu.resultado} (se esperaba ${doc.resultado}).`,
        },
        comentarioDocente: null,
      });
    } else {
      // Liquidación mensual idéntica a la solución modelo -> +1 acierto
      aciertos++;
    }
  }

  return { errores, aciertos, diferenciasDetectadas, asientosIncompletos };
}

/**
 * Compara los tres importes de un comprobante de IVA: Neto Gravado, IVA y Total.
 */
function compararImportesComprobante(
  secNombre: string,
  cDoc: ComprobanteIvaRaw,
  cAlu: ComprobanteIvaRaw,
  plantillaId: number,
  errores: ErrorDetalleItemDTO[],
  esSustituto: boolean = false
): { diferencias: number; aciertos: number } {
  let diferencias = 0;
  let aciertos = 0;

  // 1. Neto gravado
  const netoDoc = Number((cDoc.netoGravado || 0).toFixed(2));
  const netoAlu = Number((cAlu.netoGravado || 0).toFixed(2));
  if (Math.abs(netoDoc - netoAlu) > 0.01) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'IMPORTE_INCORRECTO',
      detalle: {
        seccion: secNombre,
        comprobante: cAlu.comprobante,
        celda: 'netoGravado',
        esperado: netoDoc,
        obtenido: netoAlu,
        motivo: esSustituto
          ? `Neto gravado del comprobante N° ${cAlu.comprobante} incorrecto respecto al comprobante esperado N° ${cDoc.comprobante} (obtenido $ ${netoAlu}, esperado $ ${netoDoc}).`
          : `Neto gravado del comprobante N° ${cDoc.comprobante} incorrecto (obtenido $ ${netoAlu}, esperado $ ${netoDoc}).`,
      },
      comentarioDocente: null,
    });
  } else {
    aciertos++;
  }

  // 2. IVA facturado
  const ivaDoc = Number((cDoc.iva || 0).toFixed(2));
  const ivaAlu = Number((cAlu.iva || 0).toFixed(2));
  if (Math.abs(ivaDoc - ivaAlu) > 0.01) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'IMPORTE_INCORRECTO',
      detalle: {
        seccion: secNombre,
        comprobante: cAlu.comprobante,
        celda: 'iva',
        esperado: ivaDoc,
        obtenido: ivaAlu,
        motivo: esSustituto
          ? `IVA facturado del comprobante N° ${cAlu.comprobante} incorrecto respecto al esperado N° ${cDoc.comprobante} (obtenido $ ${ivaAlu}, esperado $ ${ivaDoc}).`
          : `IVA facturado del comprobante N° ${cDoc.comprobante} incorrecto (obtenido $ ${ivaAlu}, esperado $ ${ivaDoc}).`,
      },
      comentarioDocente: null,
    });
  } else {
    aciertos++;
  }

  // 3. Total facturado
  const totalDoc = Number((cDoc.total || 0).toFixed(2));
  const totalAlu = Number((cAlu.total || 0).toFixed(2));
  if (Math.abs(totalDoc - totalAlu) > 0.01) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'IMPORTE_INCORRECTO',
      detalle: {
        seccion: secNombre,
        comprobante: cAlu.comprobante,
        celda: 'total',
        esperado: totalDoc,
        obtenido: totalAlu,
        motivo: esSustituto
          ? `Total del comprobante N° ${cAlu.comprobante} incorrecto respecto al esperado N° ${cDoc.comprobante} (obtenido $ ${totalAlu}, esperado $ ${totalDoc}).`
          : `Total del comprobante N° ${cDoc.comprobante} incorrecto (obtenido $ ${totalAlu}, esperado $ ${totalDoc}).`,
      },
      comentarioDocente: null,
    });
  } else {
    aciertos++;
  }

  return { diferencias, aciertos };
}
