import { ErrorDetalleItemDTO } from '../../dto/correccion/correccion.dto';
import { ResultadoComparacionPlantilla } from './types';

interface FilaHojaTrabajoRaw {
  idCuenta: number;
  cuenta: string;
  saldosSinAjustar?: { deudor?: number; acreedor?: number };
  ajustes?: { debe?: number; haber?: number };
  saldosAjustados?: { deudor?: number; acreedor?: number };
  estadoPatrimonial?: { activo?: number; pasivoMasPn?: number };
  estadoResultados?: { negativo?: number; positivo?: number };
}

export function compararHojaTrabajo(
  plantillaId: number,
  contenidoDocente: unknown,
  contenidoAlumno: unknown
): ResultadoComparacionPlantilla {
  const errores: ErrorDetalleItemDTO[] = [];
  let aciertos = 0;
  let diferenciasDetectadas = 0;
  let asientosIncompletos = 0;

  const doc = contenidoDocente as {
    filas?: FilaHojaTrabajoRaw[];
    resultadoDelEjercicio?: unknown;
  };
  const alu = contenidoAlumno as {
    filas?: FilaHojaTrabajoRaw[];
    resultadoDelEjercicio?: unknown;
  };

  const filasDoc = doc?.filas || [];
  const filasAlu = alu?.filas || [];

  const mapaAlu = new Map<number, FilaHojaTrabajoRaw>();
  for (const f of filasAlu) {
    mapaAlu.set(f.idCuenta, f);
  }

  for (const fDoc of filasDoc) {
    const fAlu = mapaAlu.get(fDoc.idCuenta);

    if (!fAlu) {
      asientosIncompletos++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'CUENTA_OMITIDA',
        detalle: {
          idCuenta: fDoc.idCuenta,
          cuenta: fDoc.cuenta,
          celda: 'fila',
          motivo: `La cuenta "${fDoc.cuenta}" fue omitida en la Hoja de Trabajo.`,
        },
        comentarioDocente: null,
      });
      continue;
    }

    // Lugar 1: Cuenta presente correctamente en la grilla -> +1 acierto
    aciertos++;

    // Verificar diferencias numéricas en las 5 etapas de columnas principales
    const checks = [
      {
        nombre: 'saldosSinAjustar',
        col1: 'deudor',
        col2: 'acreedor',
        vDoc1: fDoc.saldosSinAjustar?.deudor || 0,
        vDoc2: fDoc.saldosSinAjustar?.acreedor || 0,
        vAlu1: fAlu.saldosSinAjustar?.deudor || 0,
        vAlu2: fAlu.saldosSinAjustar?.acreedor || 0,
      },
      {
        nombre: 'ajustes',
        col1: 'debe',
        col2: 'haber',
        vDoc1: fDoc.ajustes?.debe || 0,
        vDoc2: fDoc.ajustes?.haber || 0,
        vAlu1: fAlu.ajustes?.debe || 0,
        vAlu2: fAlu.ajustes?.haber || 0,
      },
      {
        nombre: 'saldosAjustados',
        col1: 'deudor',
        col2: 'acreedor',
        vDoc1: fDoc.saldosAjustados?.deudor || 0,
        vDoc2: fDoc.saldosAjustados?.acreedor || 0,
        vAlu1: fAlu.saldosAjustados?.deudor || 0,
        vAlu2: fAlu.saldosAjustados?.acreedor || 0,
      },
      {
        nombre: 'estadoPatrimonial',
        col1: 'activo',
        col2: 'pasivoMasPn',
        vDoc1: fDoc.estadoPatrimonial?.activo || 0,
        vDoc2: fDoc.estadoPatrimonial?.pasivoMasPn || 0,
        vAlu1: fAlu.estadoPatrimonial?.activo || 0,
        vAlu2: fAlu.estadoPatrimonial?.pasivoMasPn || 0,
      },
      {
        nombre: 'estadoResultados',
        col1: 'negativo',
        col2: 'positivo',
        vDoc1: fDoc.estadoResultados?.negativo || 0,
        vDoc2: fDoc.estadoResultados?.positivo || 0,
        vAlu1: fAlu.estadoResultados?.negativo || 0,
        vAlu2: fAlu.estadoResultados?.positivo || 0,
      },
    ];

    for (const c of checks) {
      const dif1 = Math.abs(c.vDoc1 - c.vAlu1) > 0.01;
      const dif2 = Math.abs(c.vDoc2 - c.vAlu2) > 0.01;

      if (dif1 || dif2) {
        diferenciasDetectadas++;
        errores.push({
          idError: null,
          ejercicioPlantillaId: plantillaId,
          tipoError: 'IMPORTE_INCORRECTO',
          detalle: {
            idCuenta: fDoc.idCuenta,
            cuenta: fDoc.cuenta,
            columna: c.nombre,
            celda: dif1 && !dif2 ? c.col1 : dif2 && !dif1 ? c.col2 : c.nombre,
            esperado: { [c.col1]: c.vDoc1, [c.col2]: c.vDoc2 },
            obtenido: { [c.col1]: c.vAlu1, [c.col2]: c.vAlu2 },
            motivo: `Diferencia de importes en la columna ${c.nombre} para "${fDoc.cuenta}".`,
          },
          comentarioDocente: null,
        });
      } else {
        // Etapa de columna resuelta correctamente -> +1 acierto
        aciertos++;
      }
    }
  }

  // Comprobar filas adicionales que el alumno cargó en la Hoja de Trabajo (no presentes en la solución)
  const setDoc = new Set(filasDoc.map((f) => f.idCuenta));
  for (const fAlu of filasAlu) {
    if (!setDoc.has(fAlu.idCuenta)) {
      diferenciasDetectadas++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'CUENTA_ADICIONAL',
        detalle: {
          idCuenta: fAlu.idCuenta,
          cuenta: fAlu.cuenta,
          celda: 'fila',
          motivo: `La cuenta "${fAlu.cuenta}" no corresponde a la Hoja de Trabajo de este ejercicio.`,
        },
        comentarioDocente: null,
      });
    }
  }

  // Comparar resultado del ejercicio de forma numérica y segura
  if (!alu?.resultadoDelEjercicio && doc?.resultadoDelEjercicio) {
    asientosIncompletos++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'RESULTADO_EJERCICIO_INCOMPLETO',
      detalle: {
        celda: 'resultadoDelEjercicio',
        motivo: 'El resultado del ejercicio no fue completado en la Hoja de Trabajo.',
      },
      comentarioDocente: null,
    });
  } else if (alu?.resultadoDelEjercicio && doc?.resultadoDelEjercicio) {
    const resDoc = (doc.resultadoDelEjercicio as Record<string, number>) || {};
    const resAlu = (alu.resultadoDelEjercicio as Record<string, number>) || {};

    const difActivo = Math.abs((resDoc.activo || 0) - (resAlu.activo || 0)) > 0.01;
    const difPasivo = Math.abs((resDoc.pasivoMasPn || 0) - (resAlu.pasivoMasPn || 0)) > 0.01;
    const difNegativo = Math.abs((resDoc.negativo || 0) - (resAlu.negativo || 0)) > 0.01;
    const difPositivo = Math.abs((resDoc.positivo || 0) - (resAlu.positivo || 0)) > 0.01;

    if (difActivo || difPasivo || difNegativo || difPositivo) {
      diferenciasDetectadas++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'RESULTADO_EJERCICIO_INCORRECTO',
        detalle: {
          celda: 'resultadoDelEjercicio',
          esperado: resDoc,
          obtenido: resAlu,
          motivo: 'El resultado del ejercicio no coincide con la solución modelo.',
        },
        comentarioDocente: null,
      });
    } else {
      // Resultado del ejercicio resuelto idénticamente -> +1 acierto
      aciertos++;
    }
  }

  return { errores, aciertos, diferenciasDetectadas, asientosIncompletos };
}
