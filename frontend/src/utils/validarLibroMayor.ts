import type { ContenidoLibroMayor } from '../types/ejercicio.types';

export interface ErrorValidacionLibroMayor {
  cuenta?: number;
  movimiento?: number;
<<<<<<< HEAD
  lado?: 'DEBE' | 'HABER';
  mensaje: string;
}

=======
  mensaje: string;
}

const TOLERANCIA = 0.01;

>>>>>>> 52cb2514e70053be440beca2cc829b730a4847da
export function validarLibroMayorResuelto(
  contenido: ContenidoLibroMayor
): ErrorValidacionLibroMayor[] {
  const errores: ErrorValidacionLibroMayor[] = [];

<<<<<<< HEAD
  // ==========================================================================
  // 1. Debe existir al menos una cuenta
  // ==========================================================================
=======
  // --------------------------------------------------------------------------
  // 1. Debe existir al menos una cuenta
  // --------------------------------------------------------------------------
>>>>>>> 52cb2514e70053be440beca2cc829b730a4847da

  if (contenido.cuentas.length === 0) {
    errores.push({
      mensaje: 'Debe registrar al menos una cuenta mayorizada.',
    });

    return errores;
  }

<<<<<<< HEAD
  // ==========================================================================
  // 2. Validaciones generales de las cuentas
  // ==========================================================================
=======
  // --------------------------------------------------------------------------
  // 2. Validaciones generales de las cuentas
  // --------------------------------------------------------------------------
>>>>>>> 52cb2514e70053be440beca2cc829b730a4847da

  const cuentasRegistradas = new Set<number>();

  contenido.cuentas.forEach((cuenta, indiceCuenta) => {
    const numeroCuenta = indiceCuenta + 1;
    const nombreCuenta = cuenta.cuenta.trim() || `Cuenta ${numeroCuenta}`;

<<<<<<< HEAD
    // ------------------------------------------------------------------------
    // Cuenta contable obligatoria
    // ------------------------------------------------------------------------

=======
    // Cuenta contable obligatoria
>>>>>>> 52cb2514e70053be440beca2cc829b730a4847da
    if (!cuenta.idCuenta || cuenta.idCuenta <= 0 || !cuenta.cuenta.trim()) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: 'Debe seleccionar una cuenta contable.',
      });
    }

<<<<<<< HEAD
    // ------------------------------------------------------------------------
    // Cuenta contable repetida
    // ------------------------------------------------------------------------

=======
    // Cuenta contable repetida
>>>>>>> 52cb2514e70053be440beca2cc829b730a4847da
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
<<<<<<< HEAD
    // Al menos un movimiento entre Debe y Haber
    // ------------------------------------------------------------------------

    const totalMovimientos = cuenta.debe.length + cuenta.haber.length;

    if (totalMovimientos === 0) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `La cuenta "${nombreCuenta}" debe tener al menos un movimiento registrado en el Debe o en el Haber.`,
      });
    }

    // ==========================================================================
    // 3. Validar movimientos del Debe
    // ==========================================================================

    cuenta.debe.forEach((movimiento, indiceMovimiento) => {
      const numeroMovimiento = indiceMovimiento + 1;

      if (!movimiento.idContraCuenta || movimiento.idContraCuenta <= 0) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          lado: 'DEBE',
          mensaje: 'Debe seleccionar una contracuenta.',
        });
      }

      if (!movimiento.contraCuenta.trim()) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          lado: 'DEBE',
          mensaje: 'La contracuenta no puede estar vacía.',
        });
      }

      if (
        cuenta.idCuenta > 0 &&
        movimiento.idContraCuenta > 0 &&
        movimiento.idContraCuenta === cuenta.idCuenta
      ) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          lado: 'DEBE',
          mensaje: `La cuenta "${nombreCuenta}" no puede utilizarse a sí misma como contracuenta.`,
        });
      }

      if (!Number.isFinite(movimiento.monto) || movimiento.monto <= 0) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          lado: 'DEBE',
          mensaje: 'El monto debe ser mayor a cero.',
        });
      }
    });

    // ==========================================================================
    // 4. Validar movimientos del Haber
    // ==========================================================================

    cuenta.haber.forEach((movimiento, indiceMovimiento) => {
      const numeroMovimiento = indiceMovimiento + 1;

      if (!movimiento.idContraCuenta || movimiento.idContraCuenta <= 0) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          lado: 'HABER',
          mensaje: 'Debe seleccionar una contracuenta.',
        });
      }

      if (!movimiento.contraCuenta.trim()) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          lado: 'HABER',
          mensaje: 'La contracuenta no puede estar vacía.',
        });
      }

      if (
        cuenta.idCuenta > 0 &&
        movimiento.idContraCuenta > 0 &&
        movimiento.idContraCuenta === cuenta.idCuenta
      ) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          lado: 'HABER',
          mensaje: `La cuenta "${nombreCuenta}" no puede utilizarse a sí misma como contracuenta.`,
        });
      }

      if (!Number.isFinite(movimiento.monto) || movimiento.monto <= 0) {
        errores.push({
          cuenta: numeroCuenta,
          movimiento: numeroMovimiento,
          lado: 'HABER',
          mensaje: 'El monto debe ser mayor a cero.',
        });
      }
    });

    // ==========================================================================
    // 5. Tipo de saldo
    // ==========================================================================
=======
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
>>>>>>> 52cb2514e70053be440beca2cc829b730a4847da

    if (!cuenta.tipoSaldo) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `Debe determinar el tipo de saldo de la cuenta "${nombreCuenta}".`,
      });

      return;
    }

<<<<<<< HEAD
    // ==========================================================================
    // 6. Calcular totales
    // ==========================================================================

    const totalDebe = Number(
      cuenta.debe
        .reduce((acumulado, movimiento) => acumulado + (movimiento.monto || 0), 0)
        .toFixed(2)
    );

    const totalHaber = Number(
      cuenta.haber
        .reduce((acumulado, movimiento) => acumulado + (movimiento.monto || 0), 0)
        .toFixed(2)
    );

    const diferencia = Number((totalDebe - totalHaber).toFixed(2));

    // ==========================================================================
    // 7. Coherencia del tipo de saldo
    // ==========================================================================

    if (diferencia > 0 && cuenta.tipoSaldo !== 'DEUDOR') {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `La cuenta "${nombreCuenta}" debe tener saldo DEUDOR.`,
      });
    }

    if (diferencia < 0 && cuenta.tipoSaldo !== 'ACREEDOR') {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `La cuenta "${nombreCuenta}" debe tener saldo ACREEDOR.`,
      });
    }

    if (diferencia === 0 && cuenta.tipoSaldo !== 'SALDADA') {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `La cuenta "${nombreCuenta}" debe tener estado SALDADA porque el Debe y el Haber son iguales.`,
      });
=======
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
>>>>>>> 52cb2514e70053be440beca2cc829b730a4847da
    }
  });

  return errores;
}
