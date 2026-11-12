import type { ContenidoLibroDiario } from '../../types/ejercicio.types';
import type { ErrorDetalleCorreccion } from '../../types/espacioTrabajoCorreccion.types';

export type CampoResaltadoLibroDiario = 'cuenta' | 'movimiento' | 'debe' | 'haber';

export interface ResaltadoLibroDiario {
  numeroAsiento: number;
  indiceLinea: number;
  campo: CampoResaltadoLibroDiario;
  indiceError: number;
}

function normalizar(valor: unknown): string {
  return String(valor ?? '')
    .trim()
    .toLocaleLowerCase('es-AR');
}

function obtenerCamposDelError(error: ErrorDetalleCorreccion): CampoResaltadoLibroDiario[] {
  const celda = normalizar(error.detalle.celda);
  const campo = normalizar(error.detalle.campo);
  const motivo = normalizar(error.detalle.motivo);

  switch (error.tipoError) {
    case 'CUENTA_INCORRECTA':
    case 'CUENTA_ADICIONAL':
      return ['cuenta'];

    case 'TIPO_MOVIMIENTO_INCORRECTO':
      return ['movimiento'];

    case 'DEBE_HABER_INVERTIDO':
      return ['debe', 'haber'];

    case 'IMPORTE_INCORRECTO':
    case 'DIFERENCIA_IMPORTE': {
      const ubicacion = celda || campo;

      if (ubicacion === 'debe') return ['debe'];
      if (ubicacion === 'haber') return ['haber'];

      if (ubicacion === 'debe_haber') {
        return ['debe', 'haber'];
      }

      // Compatibilidad con errores antiguos sin celda explícita.
      const mencionaDebe = /\bdebe\b/.test(motivo);
      const mencionaHaber = /\bhaber\b/.test(motivo);

      if (mencionaDebe && mencionaHaber) {
        return ['debe', 'haber'];
      }

      if (mencionaDebe) return ['debe'];
      if (mencionaHaber) return ['haber'];

      return [];
    }

    default:
      return [];
  }
}

export function obtenerResaltadosLibroDiario(
  contenido: ContenidoLibroDiario,
  errores: ErrorDetalleCorreccion[]
): ResaltadoLibroDiario[] {
  const resaltados: ResaltadoLibroDiario[] = [];

  errores.forEach((error, indiceError) => {
    const numeroAsiento = Number(error.detalle.numeroAsiento);
    const campos = obtenerCamposDelError(error);

    if (!Number.isInteger(numeroAsiento) || numeroAsiento <= 0 || campos.length === 0) {
      return;
    }

    const asiento = contenido.asientos.find((item) => item.numero === numeroAsiento);

    if (!asiento) return;

    const idCuenta = error.detalle.idCuenta;

    const nombreCuenta =
      error.tipoError === 'CUENTA_INCORRECTA'
        ? (error.detalle.obtenido ?? error.detalle.cuenta)
        : error.detalle.cuenta;

    const tieneIdCuenta = idCuenta !== null && idCuenta !== undefined && idCuenta !== '';

    const coincidencias = asiento.lineas
      .map((linea, indiceLinea) => ({
        linea,
        indiceLinea,
      }))
      .filter(({ linea }) => {
        if (tieneIdCuenta) {
          return Number.isFinite(Number(idCuenta)) && Number(linea.idCuenta) === Number(idCuenta);
        }

        if (
          nombreCuenta === null ||
          nombreCuenta === undefined ||
          normalizar(nombreCuenta) === ''
        ) {
          return false;
        }

        return normalizar(linea.cuenta) === normalizar(nombreCuenta);
      });

    // Evitamos resaltar una línea equivocada cuando
    // hay varias coincidencias posibles.
    if (coincidencias.length !== 1) return;

    const coincidencia = coincidencias[0];

    if (!coincidencia) return;

    campos.forEach((campo) => {
      resaltados.push({
        numeroAsiento,
        indiceLinea: coincidencia.indiceLinea,
        campo,
        indiceError,
      });
    });
  });

  return resaltados;
}
