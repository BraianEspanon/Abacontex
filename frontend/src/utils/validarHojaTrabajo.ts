import type { ContenidoHojaTrabajo } from '../types/ejercicio.types';

export interface ErrorValidacionHojaTrabajo {
  fila?: number;
  mensaje: string;
}

const TOLERANCIA = 0.01;

interface TotalesHojaTrabajo {
  saldosSinAjustar: {
    deudor: number;
    acreedor: number;
  };
  ajustes: {
    debe: number;
    haber: number;
  };
  saldosAjustados: {
    deudor: number;
    acreedor: number;
  };
  estadoPatrimonial: {
    activo: number;
    pasivoMasPn: number;
  };
  estadoResultados: {
    negativo: number;
    positivo: number;
  };
}

function redondear(valor: number): number {
  return Number(valor.toFixed(2));
}

function calcularTotalesHojaTrabajo(contenido: ContenidoHojaTrabajo): TotalesHojaTrabajo {
  return contenido.filas.reduce<TotalesHojaTrabajo>(
    (acumulado, fila) => ({
      saldosSinAjustar: {
        deudor: redondear(acumulado.saldosSinAjustar.deudor + fila.saldosSinAjustar.deudor),
        acreedor: redondear(acumulado.saldosSinAjustar.acreedor + fila.saldosSinAjustar.acreedor),
      },

      ajustes: {
        debe: redondear(acumulado.ajustes.debe + fila.ajustes.debe),
        haber: redondear(acumulado.ajustes.haber + fila.ajustes.haber),
      },

      saldosAjustados: {
        deudor: redondear(acumulado.saldosAjustados.deudor + fila.saldosAjustados.deudor),
        acreedor: redondear(acumulado.saldosAjustados.acreedor + fila.saldosAjustados.acreedor),
      },

      estadoPatrimonial: {
        activo: redondear(acumulado.estadoPatrimonial.activo + fila.estadoPatrimonial.activo),
        pasivoMasPn: redondear(
          acumulado.estadoPatrimonial.pasivoMasPn + fila.estadoPatrimonial.pasivoMasPn
        ),
      },

      estadoResultados: {
        negativo: redondear(acumulado.estadoResultados.negativo + fila.estadoResultados.negativo),
        positivo: redondear(acumulado.estadoResultados.positivo + fila.estadoResultados.positivo),
      },
    }),
    {
      saldosSinAjustar: {
        deudor: 0,
        acreedor: 0,
      },
      ajustes: {
        debe: 0,
        haber: 0,
      },
      saldosAjustados: {
        deudor: 0,
        acreedor: 0,
      },
      estadoPatrimonial: {
        activo: 0,
        pasivoMasPn: 0,
      },
      estadoResultados: {
        negativo: 0,
        positivo: 0,
      },
    }
  );
}

function existeImporteNegativo(contenido: ContenidoHojaTrabajo): ErrorValidacionHojaTrabajo[] {
  const errores: ErrorValidacionHojaTrabajo[] = [];

  contenido.filas.forEach((fila, indiceFila) => {
    const importes = [
      fila.saldosSinAjustar.deudor,
      fila.saldosSinAjustar.acreedor,
      fila.ajustes.debe,
      fila.ajustes.haber,
      fila.saldosAjustados.deudor,
      fila.saldosAjustados.acreedor,
      fila.estadoPatrimonial.activo,
      fila.estadoPatrimonial.pasivoMasPn,
      fila.estadoResultados.negativo,
      fila.estadoResultados.positivo,
    ];

    if (importes.some((importe) => importe < 0)) {
      errores.push({
        fila: indiceFila + 1,
        mensaje: 'Los importes contables no pueden ser negativos.',
      });
    }
  });

  return errores;
}

export function validarHojaTrabajoResuelta(
  contenido: ContenidoHojaTrabajo
): ErrorValidacionHojaTrabajo[] {
  const errores: ErrorValidacionHojaTrabajo[] = [];

  if (contenido.filas.length === 0) {
    errores.push({
      mensaje: 'Debe registrar al menos una fila contable en la Hoja de Trabajo.',
    });

    return errores;
  }

  errores.push(...existeImporteNegativo(contenido));

  const idsCuentas = new Set<number>();
  const nombresCuentas = new Set<string>();

  contenido.filas.forEach((fila, indiceFila) => {
    const numeroFila = indiceFila + 1;
    const nombreCuenta = fila.cuenta.trim();

    // -----------------------------------------------------------------------
    // Cuenta obligatoria
    // -----------------------------------------------------------------------

    if (!Number.isInteger(fila.idCuenta) || fila.idCuenta <= 0 || !nombreCuenta) {
      errores.push({
        fila: numeroFila,
        mensaje: 'Debe seleccionar una cuenta contable válida.',
      });
    }

    // -----------------------------------------------------------------------
    // Cuenta única
    // -----------------------------------------------------------------------

    if (fila.idCuenta > 0) {
      if (idsCuentas.has(fila.idCuenta)) {
        errores.push({
          fila: numeroFila,
          mensaje: `La cuenta "${nombreCuenta || 'seleccionada'}" está repetida.`,
        });
      } else {
        idsCuentas.add(fila.idCuenta);
      }
    }

    if (nombreCuenta) {
      const nombreNormalizado = nombreCuenta.toLowerCase();

      if (nombresCuentas.has(nombreNormalizado)) {
        if (!idsCuentas.has(fila.idCuenta)) {
          errores.push({
            fila: numeroFila,
            mensaje: `La cuenta "${nombreCuenta}" está repetida.`,
          });
        }
      } else {
        nombresCuentas.add(nombreNormalizado);
      }
    }

    // -----------------------------------------------------------------------
    // Saldos sin ajustar
    // -----------------------------------------------------------------------

    if (fila.saldosSinAjustar.deudor > 0 && fila.saldosSinAjustar.acreedor > 0) {
      errores.push({
        fila: numeroFila,
        mensaje: `La cuenta "${
          nombreCuenta || `Fila ${numeroFila}`
        }" no puede tener saldo Deudor y Acreedor simultáneamente en Saldos sin ajustar.`,
      });
    }

    // -----------------------------------------------------------------------
    // Saldos ajustados
    // -----------------------------------------------------------------------

    if (fila.saldosAjustados.deudor > 0 && fila.saldosAjustados.acreedor > 0) {
      errores.push({
        fila: numeroFila,
        mensaje: `La cuenta "${
          nombreCuenta || `Fila ${numeroFila}`
        }" no puede tener saldo Deudor y Acreedor simultáneamente en Saldos ajustados.`,
      });
    }

    // -----------------------------------------------------------------------
    // Estado Patrimonial vs Estado de Resultados
    // -----------------------------------------------------------------------

    const tienePatrimonial =
      fila.estadoPatrimonial.activo > 0 || fila.estadoPatrimonial.pasivoMasPn > 0;

    const tieneResultados =
      fila.estadoResultados.negativo > 0 || fila.estadoResultados.positivo > 0;

    if (tienePatrimonial && tieneResultados) {
      errores.push({
        fila: numeroFila,
        mensaje: `La cuenta "${
          nombreCuenta || `Fila ${numeroFila}`
        }" no puede trasladarse al Estado Patrimonial y al Estado de Resultados simultáneamente.`,
      });
    }

    // -----------------------------------------------------------------------
    // Activo vs Pasivo + PN
    // -----------------------------------------------------------------------

    if (fila.estadoPatrimonial.activo > 0 && fila.estadoPatrimonial.pasivoMasPn > 0) {
      errores.push({
        fila: numeroFila,
        mensaje: `La cuenta "${
          nombreCuenta || `Fila ${numeroFila}`
        }" no puede tener importe en Activo y Pasivo + PN simultáneamente.`,
      });
    }

    // -----------------------------------------------------------------------
    // Resultado negativo vs positivo
    // -----------------------------------------------------------------------

    if (fila.estadoResultados.negativo > 0 && fila.estadoResultados.positivo > 0) {
      errores.push({
        fila: numeroFila,
        mensaje: `La cuenta "${
          nombreCuenta || `Fila ${numeroFila}`
        }" no puede tener importe en Resultados Negativo y Positivo simultáneamente.`,
      });
    }
  });

  // =========================================================================
  // Balance de columnas
  // =========================================================================

  const totales = calcularTotalesHojaTrabajo(contenido);

  if (Math.abs(totales.saldosSinAjustar.deudor - totales.saldosSinAjustar.acreedor) > TOLERANCIA) {
    errores.push({
      mensaje:
        `La columna de Saldos sin ajustar está desbalanceada ` +
        `(Total Deudor: $ ${totales.saldosSinAjustar.deudor}, ` +
        `Total Acreedor: $ ${totales.saldosSinAjustar.acreedor}).`,
    });
  }

  if (Math.abs(totales.ajustes.debe - totales.ajustes.haber) > TOLERANCIA) {
    errores.push({
      mensaje:
        `La columna de Ajustes está desbalanceada ` +
        `(Total Debe: $ ${totales.ajustes.debe}, ` +
        `Total Haber: $ ${totales.ajustes.haber}).`,
    });
  }

  if (Math.abs(totales.saldosAjustados.deudor - totales.saldosAjustados.acreedor) > TOLERANCIA) {
    errores.push({
      mensaje:
        `La columna de Saldos ajustados está desbalanceada ` +
        `(Total Deudor: $ ${totales.saldosAjustados.deudor}, ` +
        `Total Acreedor: $ ${totales.saldosAjustados.acreedor}).`,
    });
  }

  return errores;
}
