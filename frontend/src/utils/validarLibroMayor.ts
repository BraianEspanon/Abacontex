import type { ContenidoLibroMayor } from '../types/ejercicio.types';

export interface ErrorValidacionLibroMayor {
  cuenta?: number;
  movimiento?: number;
  mensaje: string;
}

const TOLERANCIA = 0.01;

export function validarLibroMayorResuelto(
  contenido: ContenidoLibroMayor
): ErrorValidacionLibroMayor[] {
  const errores: ErrorValidacionLibroMayor[] = [];

  // --------------------------------------------------------------------------
  // 1. Debe existir al menos una cuenta
  // --------------------------------------------------------------------------

  if (contenido.cuentas.length === 0) {
    errores.push({
      mensaje: 'Debe registrar al menos una cuenta mayorizada.',
    });

    return errores;
  }

  // --------------------------------------------------------------------------
  // 2. Validaciones generales de las cuentas
  // --------------------------------------------------------------------------

  const cuentasRegistradas = new Set<number>();

  contenido.cuentas.forEach((cuenta, indiceCuenta) => {
    const numeroCuenta = indiceCuenta + 1;
    const nombreCuenta = cuenta.cuenta.trim() || `Cuenta ${numeroCuenta}`;

    // Cuenta contable obligatoria
    if (!cuenta.idCuenta || cuenta.idCuenta <= 0 || !cuenta.cuenta.trim()) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: 'Debe seleccionar una cuenta contable.',
      });
    }

    // Cuenta contable repetida
    if (cuenta.idCuenta > 0) {
      if (cuentasRegistradas.has(cuenta.idCuenta)) {
        errores.push({
          cuenta: numeroCuenta,
          mensaje: `La cuenta "${nombreCuenta}" se encuentra repetida en el Libro Mayor.`,
        });
      } else {
        cuentasRegistradas.add(cuenta.idCuenta);
      }
    }

    // ------------------------------------------------------------------------
    // 3. Cada cuenta debe tener al menos un movimiento
    // ------------------------------------------------------------------------

    if (cuenta.movimientos.length === 0) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `La cuenta "${nombreCuenta}" debe tener al menos un movimiento registrado.`,
      });

      return;
    }

    let acumuladoDebe = 0;
    let acumuladoHaber = 0;

    // ------------------------------------------------------------------------
    // 4. Validaciones de los movimientos
    // ------------------------------------------------------------------------

    cuenta.movimientos.forEach((movimiento, indiceMovimiento) => {
      const numeroMovimiento = indiceMovimiento + 1;

      // Importes negativos
      if (movimiento.debe < 0 || movimiento.haber < 0) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          mensaje: 'Los importes al Debe y al Haber no pueden ser negativos.',
        });
      }

      // Debe existir un importe
      if (movimiento.debe === 0 && movimiento.haber === 0) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          mensaje: 'Debe ingresar un importe al Debe o al Haber.',
        });
      }

      // No se permiten Debe y Haber simultáneamente
      if (movimiento.debe > 0 && movimiento.haber > 0) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          mensaje: 'No puede ingresar importes al Debe y al Haber simultáneamente.',
        });
      }

      // ----------------------------------------------------------------------
      // 5. Comprobar saldo acumulado
      // ----------------------------------------------------------------------

      acumuladoDebe += movimiento.debe || 0;
      acumuladoHaber += movimiento.haber || 0;

      const saldoCalculado = Number(Math.abs(acumuladoDebe - acumuladoHaber).toFixed(2));

      if (Math.abs(movimiento.saldo - saldoCalculado) > TOLERANCIA) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          mensaje: `El saldo del movimiento no coincide con el saldo acumulado calculado ($ ${saldoCalculado.toFixed(
            2
          )}).`,
        });
      }
    });

    // ------------------------------------------------------------------------
    // 6. Comprobar saldo final
    // ------------------------------------------------------------------------

    const diferencia = Number((acumuladoDebe - acumuladoHaber).toFixed(2));

    const saldoFinalCalculado = Math.abs(diferencia);

    if (Math.abs(cuenta.saldoFinal - saldoFinalCalculado) > TOLERANCIA) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `El saldo final de la cuenta no coincide con el saldo calculado ($ ${saldoFinalCalculado.toFixed(
          2
        )}).`,
      });
    }

    // ------------------------------------------------------------------------
    // 7. Tipo de saldo obligatorio
    // ------------------------------------------------------------------------

    if (!cuenta.tipoSaldo) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `Debe determinar el tipo de saldo de la cuenta "${nombreCuenta}".`,
      });

      return;
    }

    // ------------------------------------------------------------------------
    // 8. Coherencia DEUDOR / ACREEDOR
    // ------------------------------------------------------------------------

    if (saldoFinalCalculado > 0) {
      if (acumuladoDebe > acumuladoHaber && cuenta.tipoSaldo !== 'DEUDOR') {
        errores.push({
          cuenta: numeroCuenta,
          mensaje: `La cuenta "${nombreCuenta}" debe tener saldo DEUDOR.`,
        });
      }

      if (acumuladoHaber > acumuladoDebe && cuenta.tipoSaldo !== 'ACREEDOR') {
        errores.push({
          cuenta: numeroCuenta,
          mensaje: `La cuenta "${nombreCuenta}" debe tener saldo ACREEDOR.`,
        });
      }
    }
  });

  return errores;
}
