import { ErrorDetalleItemDTO } from '../../dto/correccion/correccion.dto';
import { ResultadoComparacionPlantilla } from './types';

interface CuentaMayorRaw {
  idCuenta: number;
  cuenta: string;
  debe?: Array<{ monto?: number }>;
  haber?: Array<{ monto?: number }>;
  tipoSaldo?: string | null;
}

export function compararLibroMayor(
  plantillaId: number,
  contenidoDocente: unknown,
  contenidoAlumno: unknown
): ResultadoComparacionPlantilla {
  const errores: ErrorDetalleItemDTO[] = [];
  let aciertos = 0;
  let diferenciasDetectadas = 0;
  let asientosIncompletos = 0;

  const doc = (contenidoDocente as { cuentas?: CuentaMayorRaw[] })?.cuentas || [];
  const alu = (contenidoAlumno as { cuentas?: CuentaMayorRaw[] })?.cuentas || [];

  const mapaAlu = new Map<number, CuentaMayorRaw>();
  for (const c of alu) {
    mapaAlu.set(c.idCuenta, c);
  }

  const cuentasFaltantesDoc: CuentaMayorRaw[] = [];

  // 1. Emparejamiento directo por idCuenta (independiente del orden)
  for (const cDoc of doc) {
    const cAlu = mapaAlu.get(cDoc.idCuenta);

    if (!cAlu) {
      cuentasFaltantesDoc.push(cDoc);
      continue;
    }

    // Lugar 1: Cuenta seleccionada correctamente -> +1 acierto
    aciertos++;

    // Lugares 2, 3, 4 y 5: Total Debe, Total Haber, Saldo y Tipo de Saldo
    const resTotales = compararTotalesYSaldos(cDoc, cAlu, plantillaId, errores, false);
    diferenciasDetectadas += resTotales.diferencias;
    aciertos += resTotales.aciertos;
  }

  // Identificar cuentas del alumno que no coincidieron con ninguna del docente
  const setDoc = new Set(doc.map((c) => c.idCuenta));
  const cuentasSobrantesAlu = alu.filter((c) => !setDoc.has(c.idCuenta));

  // 2. Desempate de cuentas no emparejadas
  if (cuentasFaltantesDoc.length === 1 && cuentasSobrantesAlu.length === 1) {
    // Caso A: Certeza Unívoca (falta exactamente 1 y sobra exactamente 1)
    // Es claramente una sustitución/equivocación de cuenta -> CUENTA_INCORRECTA
    const cDocUnica = cuentasFaltantesDoc[0]!;
    const cAluUnica = cuentasSobrantesAlu[0]!;

    diferenciasDetectadas++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'CUENTA_INCORRECTA',
      detalle: {
        idCuenta: cAluUnica.idCuenta,
        cuenta: cAluUnica.cuenta,
        celda: 'cuenta',
        esperado: cDocUnica.cuenta,
        obtenido: cAluUnica.cuenta,
        motivo: `Se esperaba mayorizar la cuenta "${cDocUnica.cuenta}", pero se mayorizó "${cAluUnica.cuenta}".`,
      },
      comentarioDocente: null,
    });

    // Comparamos totales, saldo y tipo de saldo de la cuenta sustituta contra la solución esperada del docente
    const resTotales = compararTotalesYSaldos(cDocUnica, cAluUnica, plantillaId, errores, true);
    diferenciasDetectadas += resTotales.diferencias;
    aciertos += resTotales.aciertos;
  } else {
    // Caso B: Múltiples cuentas sin emparejar (ambigüedad)
    // Faltantes del docente -> CUENTA_MAYORIZAR_OMITIDA
    for (const cDoc of cuentasFaltantesDoc) {
      asientosIncompletos++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'CUENTA_MAYORIZAR_OMITIDA',
        detalle: {
          idCuenta: cDoc.idCuenta,
          cuenta: cDoc.cuenta,
          celda: 'cuenta',
          motivo: `La cuenta "${cDoc.cuenta}" no fue mayorizada.`,
        },
        comentarioDocente: null,
      });
    }

    // Sobrantes del alumno -> CUENTA_ADICIONAL y evaluación de saldo
    for (const cAlu of cuentasSobrantesAlu) {
      diferenciasDetectadas++;
      errores.push({
        idError: null,
        ejercicioPlantillaId: plantillaId,
        tipoError: 'CUENTA_ADICIONAL',
        detalle: {
          idCuenta: cAlu.idCuenta,
          cuenta: cAlu.cuenta,
          celda: 'cuenta',
          motivo: `La cuenta "${cAlu.cuenta}" no correspondía ser mayorizada en este ejercicio.`,
        },
        comentarioDocente: null,
      });

      diferenciasDetectadas += evaluarSaldoInternoCuenta(cAlu, plantillaId, errores);
    }
  }

  return { errores, aciertos, diferenciasDetectadas, asientosIncompletos };
}

/**
 * Compara los totales de Debe y Haber, el saldo neto y el tipo de saldo entre la cuenta docente y la del alumno.
 */
function compararTotalesYSaldos(
  cDoc: CuentaMayorRaw,
  cAlu: CuentaMayorRaw,
  plantillaId: number,
  errores: ErrorDetalleItemDTO[],
  esSustituto: boolean = false
): { diferencias: number; aciertos: number } {
  let diferencias = 0;
  let aciertos = 0;

  const totalDebeDoc = Number(
    (cDoc.debe || []).reduce((acc, l) => acc + (l.monto || 0), 0).toFixed(2)
  );
  const totalHaberDoc = Number(
    (cDoc.haber || []).reduce((acc, l) => acc + (l.monto || 0), 0).toFixed(2)
  );
  const saldoDoc = Math.abs(Number((totalDebeDoc - totalHaberDoc).toFixed(2)));
  const tipoSaldoDoc =
    totalDebeDoc > totalHaberDoc ? 'DEUDOR' : totalDebeDoc < totalHaberDoc ? 'ACREEDOR' : 'SALDADA';

  const totalDebeAlu = Number(
    (cAlu.debe || []).reduce((acc, l) => acc + (l.monto || 0), 0).toFixed(2)
  );
  const totalHaberAlu = Number(
    (cAlu.haber || []).reduce((acc, l) => acc + (l.monto || 0), 0).toFixed(2)
  );
  const saldoAlu = Math.abs(Number((totalDebeAlu - totalHaberAlu).toFixed(2)));
  const tipoSaldoAluCalculado =
    totalDebeAlu > totalHaberAlu ? 'DEUDOR' : totalDebeAlu < totalHaberAlu ? 'ACREEDOR' : 'SALDADA';
  const tipoSaldoAlu = cAlu.tipoSaldo || tipoSaldoAluCalculado;

  // 1. Total Debe
  if (Math.abs(totalDebeDoc - totalDebeAlu) > 0.01) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'IMPORTE_INCORRECTO',
      detalle: {
        idCuenta: cAlu.idCuenta,
        cuenta: cAlu.cuenta,
        celda: 'debe',
        esperado: totalDebeDoc,
        obtenido: totalDebeAlu,
        motivo: esSustituto
          ? `Total del Debe de "${cAlu.cuenta}" incorrecto respecto a la cuenta esperada "${cDoc.cuenta}" (obtenido $ ${totalDebeAlu}, esperado $ ${totalDebeDoc}).`
          : `Total del Debe de "${cDoc.cuenta}" incorrecto (obtenido $ ${totalDebeAlu}, esperado $ ${totalDebeDoc}).`,
      },
      comentarioDocente: null,
    });
  } else {
    aciertos++;
  }

  // 2. Total Haber
  if (Math.abs(totalHaberDoc - totalHaberAlu) > 0.01) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'IMPORTE_INCORRECTO',
      detalle: {
        idCuenta: cAlu.idCuenta,
        cuenta: cAlu.cuenta,
        celda: 'haber',
        esperado: totalHaberDoc,
        obtenido: totalHaberAlu,
        motivo: esSustituto
          ? `Total del Haber de "${cAlu.cuenta}" incorrecto respecto a la cuenta esperada "${cDoc.cuenta}" (obtenido $ ${totalHaberAlu}, esperado $ ${totalHaberDoc}).`
          : `Total del Haber de "${cDoc.cuenta}" incorrecto (obtenido $ ${totalHaberAlu}, esperado $ ${totalHaberDoc}).`,
      },
      comentarioDocente: null,
    });
  } else {
    aciertos++;
  }

  // 3. Saldo neto
  if (Math.abs(saldoDoc - saldoAlu) > 0.01) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'SALDO_FINAL_INCORRECTO',
      detalle: {
        idCuenta: cAlu.idCuenta,
        cuenta: cAlu.cuenta,
        celda: 'saldo',
        esperado: saldoDoc,
        obtenido: saldoAlu,
        motivo: esSustituto
          ? `Saldo final de "${cAlu.cuenta}" incorrecto respecto a la cuenta esperada "${cDoc.cuenta}" (obtenido $ ${saldoAlu}, esperado $ ${saldoDoc}).`
          : `Saldo final de "${cDoc.cuenta}" incorrecto (obtenido $ ${saldoAlu}, esperado $ ${saldoDoc}).`,
      },
      comentarioDocente: null,
    });
  } else {
    aciertos++;
  }

  // 4. Tipo de saldo
  if (tipoSaldoDoc !== tipoSaldoAlu) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'TIPO_SALDO_INCORRECTO',
      detalle: {
        idCuenta: cAlu.idCuenta,
        cuenta: cAlu.cuenta,
        celda: 'tipoSaldo',
        esperado: tipoSaldoDoc,
        obtenido: tipoSaldoAlu,
        motivo:
          cAlu.tipoSaldo && cAlu.tipoSaldo !== tipoSaldoAluCalculado
            ? `En "${cAlu.cuenta}", los movimientos determinan saldo ${tipoSaldoAluCalculado}, pero se seleccionó "${cAlu.tipoSaldo}" (esperado: ${tipoSaldoDoc}).`
            : `Tipo de saldo incorrecto en "${cAlu.cuenta}" (esperado: ${tipoSaldoDoc}, obtenido: ${tipoSaldoAlu}).`,
      },
      comentarioDocente: null,
    });
  } else if (cAlu.tipoSaldo && cAlu.tipoSaldo !== tipoSaldoAluCalculado) {
    diferencias++;
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'TIPO_SALDO_INCORRECTO',
      detalle: {
        idCuenta: cAlu.idCuenta,
        cuenta: cAlu.cuenta,
        celda: 'tipoSaldo',
        esperado: tipoSaldoAluCalculado,
        obtenido: cAlu.tipoSaldo,
        motivo: `Contradicción en "${cAlu.cuenta}": se seleccionó "${cAlu.tipoSaldo}", pero la sumatoria del Debe ($ ${totalDebeAlu}) y Haber ($ ${totalHaberAlu}) determina saldo ${tipoSaldoAluCalculado}.`,
      },
      comentarioDocente: null,
    });
  } else {
    aciertos++;
  }

  return { diferencias, aciertos };
}

/**
 * Evalúa si el alumno seleccionó un tipo de saldo contradictorio
 * con los movimientos numéricos que él mismo cargó en la cuenta T.
 */
function evaluarSaldoInternoCuenta(
  cAlu: CuentaMayorRaw,
  plantillaId: number,
  errores: ErrorDetalleItemDTO[]
): number {
  const totalDebeAlu = Number(
    (cAlu.debe || []).reduce((acc, l) => acc + (l.monto || 0), 0).toFixed(2)
  );
  const totalHaberAlu = Number(
    (cAlu.haber || []).reduce((acc, l) => acc + (l.monto || 0), 0).toFixed(2)
  );
  const tipoSaldoAluCalculado =
    totalDebeAlu > totalHaberAlu ? 'DEUDOR' : totalDebeAlu < totalHaberAlu ? 'ACREEDOR' : 'SALDADA';

  if (cAlu.tipoSaldo && cAlu.tipoSaldo !== tipoSaldoAluCalculado) {
    errores.push({
      idError: null,
      ejercicioPlantillaId: plantillaId,
      tipoError: 'TIPO_SALDO_INCORRECTO',
      detalle: {
        idCuenta: cAlu.idCuenta,
        cuenta: cAlu.cuenta,
        celda: 'tipoSaldo',
        esperado: tipoSaldoAluCalculado,
        obtenido: cAlu.tipoSaldo,
        motivo: `En la cuenta "${cAlu.cuenta}", la sumatoria del Debe ($ ${totalDebeAlu}) y el Haber ($ ${totalHaberAlu}) determina que la cuenta está ${tipoSaldoAluCalculado}, pero se seleccionó "${cAlu.tipoSaldo}".`,
      },
      comentarioDocente: null,
    });
    return 1;
  }

  return 0;
}
