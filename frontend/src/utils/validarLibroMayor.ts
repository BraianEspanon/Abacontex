import type { ContenidoLibroMayor } from '../types/ejercicio.types';

export interface ErrorValidacionLibroMayor {
  cuenta?: number;
  movimiento?: number;
  lado?: 'DEBE' | 'HABER';
  mensaje: string;
}

export function validarLibroMayorResuelto(
  contenido: ContenidoLibroMayor
): ErrorValidacionLibroMayor[] {
  const errores: ErrorValidacionLibroMayor[] = [];

  // ==========================================================================
  // 1. Debe existir al menos una cuenta
  // ==========================================================================

  if (contenido.cuentas.length === 0) {
    errores.push({
      mensaje: 'Debe registrar al menos una cuenta mayorizada.',
    });

    return errores;
  }

  // ==========================================================================
  // 2. Validaciones generales de las cuentas
  // ==========================================================================

  const cuentasRegistradas = new Set<number>();

  contenido.cuentas.forEach((cuenta, indiceCuenta) => {
    const numeroCuenta = indiceCuenta + 1;
    const nombreCuenta = cuenta.cuenta.trim() || `Cuenta ${numeroCuenta}`;

    // ------------------------------------------------------------------------
    // Cuenta contable obligatoria
    // ------------------------------------------------------------------------

    if (!cuenta.idCuenta || cuenta.idCuenta <= 0 || !cuenta.cuenta.trim()) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: 'Debe seleccionar una cuenta contable.',
      });
    }

    // ------------------------------------------------------------------------
    // Cuenta contable repetida
    // ------------------------------------------------------------------------

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

    if (!cuenta.tipoSaldo) {
      errores.push({
        cuenta: numeroCuenta,
        mensaje: `Debe determinar el tipo de saldo de la cuenta "${nombreCuenta}".`,
      });

      return;
    }

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
    }
  });

  return errores;
}
