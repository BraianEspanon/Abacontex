import { TipoErrorCorreccion, TipoPlantillaEjercicio } from '@prisma/client';
import { ErrorDetalleItemDTO, KpisCorreccionDTO } from '../../dto/correccion/correccion.dto';
import { ResultadoComparacionPlantilla } from './types';
import { compararLibroDiario } from './libro-diario.comparador';
import { compararLibroMayor } from './libro-mayor.comparador';
import { compararLibroIva } from './libro-iva.comparador';
import { compararHojaTrabajo } from './hoja-trabajo.comparador';

export * from './types';
export * from './libro-diario.comparador';
export * from './libro-mayor.comparador';
export * from './libro-iva.comparador';
export * from './hoja-trabajo.comparador';

export interface PlantillaComparacionInput {
  ejercicioPlantillaId: number;
  tipo: TipoPlantillaEjercicio;
  contenidoDocente: unknown;
  contenidoAlumno: unknown;
  erroresPreviosDocente?:
    | Array<{
        idError: number;
        ejercicioPlantillaId: number;
        tipoError: TipoErrorCorreccion;
        detalle: unknown;
        comentarioDocente: string | null;
      }>
    | undefined;
}

export interface ResultadoComparacionEntrega {
  erroresPorPlantilla: Map<number, ErrorDetalleItemDTO[]>;
  kpis: KpisCorreccionDTO;
}

/**
 * Orquestador principal: compara la resolución del alumno con la solución modelo del docente
 * delegando deterministamente a cada comparador específico por plantilla (< 20 ms).
 */
export function compararResolucionConModelo(
  plantillasDocente: PlantillaComparacionInput[]
): ResultadoComparacionEntrega {
  const erroresPorPlantilla = new Map<number, ErrorDetalleItemDTO[]>();
  let aciertosTotales = 0;
  let diferenciasTotales = 0;
  let incompletosTotales = 0;
  let totalErrores = 0;

  for (const p of plantillasDocente) {
    // Si la plantilla no cuenta con solución modelo cargada por el docente,
    // no ejecutamos el comparador determinista ni validamos diferencias relativas.
    if (!p.contenidoDocente) {
      erroresPorPlantilla.set(p.ejercicioPlantillaId, []);
      continue;
    }

    let res: ResultadoComparacionPlantilla = {
      errores: [],
      aciertos: 0,
      diferenciasDetectadas: 0,
      asientosIncompletos: 0,
    };

    switch (p.tipo) {
      case 'LIBRO_DIARIO':
        res = compararLibroDiario(p.ejercicioPlantillaId, p.contenidoDocente, p.contenidoAlumno);
        break;
      case 'LIBRO_MAYOR':
        res = compararLibroMayor(p.ejercicioPlantillaId, p.contenidoDocente, p.contenidoAlumno);
        break;
      case 'LIBRO_IVA':
        res = compararLibroIva(p.ejercicioPlantillaId, p.contenidoDocente, p.contenidoAlumno);
        break;
      case 'HOJA_TRABAJO':
        res = compararHojaTrabajo(p.ejercicioPlantillaId, p.contenidoDocente, p.contenidoAlumno);
        break;
    }

    // Si existen errores previamente guardados por el docente (con observaciones o idError en DB),
    // fusionamos los comentarios existentes
    if (p.erroresPreviosDocente && p.erroresPreviosDocente.length > 0) {
      res.errores = fusionarComentariosPrevios(res.errores, p.erroresPreviosDocente);
    }

    erroresPorPlantilla.set(p.ejercicioPlantillaId, res.errores);
    aciertosTotales += res.aciertos;
    diferenciasTotales += res.diferenciasDetectadas;
    incompletosTotales += res.asientosIncompletos;
    totalErrores += res.errores.length;
  }

  return {
    erroresPorPlantilla,
    kpis: {
      aciertos: aciertosTotales,
      diferenciasDetectadas: diferenciasTotales,
      asientosIncompletos: incompletosTotales,
      totalErrores,
    },
  };
}

function coincidenDetalles(a: unknown, b: unknown): boolean {
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return true;
  const detA = a as Record<string, unknown>;
  const detB = b as Record<string, unknown>;

  if (detA.numeroAsiento !== undefined && detB.numeroAsiento !== undefined) {
    if (detA.numeroAsiento !== detB.numeroAsiento) return false;
  }
  if (detA.idCuenta !== undefined && detB.idCuenta !== undefined) {
    if (detA.idCuenta !== detB.idCuenta) return false;
  }
  if (detA.celda !== undefined && detB.celda !== undefined) {
    if (detA.celda !== detB.celda) return false;
  }
  if (detA.comprobante !== undefined && detB.comprobante !== undefined) {
    if (detA.comprobante !== detB.comprobante) return false;
  }
  if (detA.columna !== undefined && detB.columna !== undefined) {
    if (detA.columna !== detB.columna) return false;
  }
  return true;
}

function fusionarComentariosPrevios(
  detectados: ErrorDetalleItemDTO[],
  guardados: Array<{
    idError: number;
    ejercicioPlantillaId: number;
    tipoError: TipoErrorCorreccion;
    detalle: unknown;
    comentarioDocente: string | null;
  }>
): ErrorDetalleItemDTO[] {
  const resultado = [...detectados];

  for (const g of guardados) {
    const match = resultado.find(
      (d) =>
        d.ejercicioPlantillaId === g.ejercicioPlantillaId &&
        d.tipoError === g.tipoError &&
        d.idError === null &&
        coincidenDetalles(d.detalle, g.detalle)
    );

    if (match) {
      match.idError = g.idError;
      match.comentarioDocente = g.comentarioDocente;
    } else {
      resultado.push({
        idError: g.idError,
        ejercicioPlantillaId: g.ejercicioPlantillaId,
        tipoError: g.tipoError,
        detalle: (g.detalle as Record<string, unknown>) || {},
        comentarioDocente: g.comentarioDocente,
      });
    }
  }

  return resultado;
}
