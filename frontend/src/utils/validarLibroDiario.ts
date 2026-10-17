import type { ContenidoLibroDiario } from '../types/ejercicio.types';

export interface ErrorValidacionLibroDiario {
  asiento?: number;
  mensaje: string;
}

export function validarLibroDiarioResuelto(
  contenido: ContenidoLibroDiario
): ErrorValidacionLibroDiario[] {
  const errores: ErrorValidacionLibroDiario[] = [];

  if (contenido.asientos.length === 0) {
    errores.push({
      mensaje: 'Debe registrar al menos un asiento contable.',
    });

    return errores;
  }

  for (const asiento of contenido.asientos) {
    if (!asiento.fecha) {
      errores.push({
        asiento: asiento.numero,
        mensaje: 'Debe ingresar la fecha.',
      });
    }

    if (!asiento.concepto.trim()) {
      errores.push({
        asiento: asiento.numero,
        mensaje: 'Debe ingresar el concepto.',
      });
    }

    if (asiento.lineas.length < 2) {
      errores.push({
        asiento: asiento.numero,
        mensaje: 'Debe contener al menos dos líneas contables.',
      });
    }

    for (let indice = 0; indice < asiento.lineas.length; indice += 1) {
      const linea = asiento.lineas[indice];

      if (!linea) continue;

      const numeroLinea = indice + 1;

      if (!linea.idCuenta || linea.idCuenta <= 0) {
        errores.push({
          asiento: asiento.numero,
          mensaje: `La línea ${numeroLinea} no tiene una cuenta seleccionada.`,
        });
      }

      const debe = Number(linea.debe || 0);
      const haber = Number(linea.haber || 0);

      if (debe < 0 || haber < 0) {
        errores.push({
          asiento: asiento.numero,
          mensaje: `La línea ${numeroLinea} no puede contener importes negativos.`,
        });
      }

      if (debe === 0 && haber === 0) {
        errores.push({
          asiento: asiento.numero,
          mensaje: `La línea ${numeroLinea} debe tener un importe en Debe o Haber.`,
        });
      }

      if (debe > 0 && haber > 0) {
        errores.push({
          asiento: asiento.numero,
          mensaje: `La línea ${numeroLinea} no puede tener importes simultáneamente en Debe y Haber.`,
        });
      }
    }

    const totalDebe = Number(
      asiento.lineas.reduce((total, linea) => total + Number(linea.debe || 0), 0).toFixed(2)
    );

    const totalHaber = Number(
      asiento.lineas.reduce((total, linea) => total + Number(linea.haber || 0), 0).toFixed(2)
    );

    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      errores.push({
        asiento: asiento.numero,
        mensaje: `El asiento está desbalanceado (Debe: $${totalDebe.toLocaleString(
          'es-AR'
        )} - Haber: $${totalHaber.toLocaleString('es-AR')}).`,
      });
    }
  }

  return errores;
}
