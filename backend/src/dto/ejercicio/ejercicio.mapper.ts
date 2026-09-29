import {
  DetalleEjercicioResponseDTO,
  EjercicioCreadoResponseDTO,
  EjercicioItemDTO,
  ListadoEjerciciosResponseDTO,
  ResolucionDocenteResponseDTO,
  ResumenEjerciciosDTO,
} from './ejercicio.dto';
import {
  EjercicioCreadoEntity,
  EjercicioListItemEntity,
  EjercicioResolucionEntity,
} from '../../repositories/ejercicio.repository';

export function toEjercicioCreadoResponse(
  ejercicio: EjercicioCreadoEntity
): EjercicioCreadoResponseDTO {
  return {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    enunciado: ejercicio.enunciado,
    estado: ejercicio.estado,
    indicaciones: ejercicio.indicaciones,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
      año: ejercicio.curso.año,
    },
    plantillas: ejercicio.plantillas.map((p) => ({
      idEjercicioPlantilla: p.idEjercicioPlantilla,
      tipo: p.tipo,
    })),
    generacionIA: ejercicio.generacionIA
      ? {
          idGeneracion: ejercicio.generacionIA.idGeneracion,
          tipoEjercicio: ejercicio.generacionIA.tipoEjercicio,
          dificultad: ejercicio.generacionIA.dificultad,
          contextoAdicional: ejercicio.generacionIA.contextoAdicional,
          contenidos: ejercicio.generacionIA.contenidos.map((c) => c.contenido),
        }
      : null,
    resolucion: ejercicio.resolucion
      ? {
          idResolucion: ejercicio.resolucion.idResolucion,
          estado: ejercicio.resolucion.estado,
        }
      : null,
    createdAt: ejercicio.createdAt.toISOString(),
    updatedAt: ejercicio.updatedAt.toISOString(),
  };
}

export function calcularEstadoVisual(estado: string, estadoResolucion?: string | null): string {
  if (estado === 'BORRADOR') {
    return 'Borrador';
  }
  if (estado === 'FINALIZADO') {
    return 'Finalizado';
  }
  if (estado === 'PUBLICADO') {
    if (estadoResolucion === 'COMPLETADA') {
      return 'Resuelto';
    }
    return 'Sin resolver';
  }
  return estado;
}

export function toEjercicioItemResponse(ejercicio: EjercicioListItemEntity): EjercicioItemDTO {
  return {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
      año: ejercicio.curso.año,
    },
    estado: ejercicio.estado,
    estadoVisual: calcularEstadoVisual(ejercicio.estado, ejercicio.resolucion?.estado),
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    totalEntregas: 0,
    createdAt: ejercicio.createdAt.toISOString(),
    updatedAt: ejercicio.updatedAt.toISOString(),
  };
}

export function toListadoEjerciciosResponse(
  items: EjercicioListItemEntity[],
  totalItems: number,
  page: number,
  pageSize: number,
  resumen: ResumenEjerciciosDTO
): ListadoEjerciciosResponseDTO {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return {
    items: items.map(toEjercicioItemResponse),
    page,
    pageSize,
    totalItems,
    totalPages,
    resumen,
  };
}

export function toDetalleEjercicioResponse(
  ejercicio: EjercicioCreadoEntity,
  totalAlumnos: number
): DetalleEjercicioResponseDTO {
  const origen = ejercicio.generacionIA !== null ? 'IA' : 'DIGITALIZADO';

  return {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    enunciado: ejercicio.enunciado,
    estado: ejercicio.estado,
    estadoVisual: calcularEstadoVisual(ejercicio.estado, ejercicio.resolucion?.estado),
    indicaciones: ejercicio.indicaciones,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    origen,
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
      año: ejercicio.curso.año,
    },
    plantillas: ejercicio.plantillas.map((p) => ({
      idEjercicioPlantilla: p.idEjercicioPlantilla,
      tipo: p.tipo,
    })),
    generacionIA: ejercicio.generacionIA
      ? {
          idGeneracion: ejercicio.generacionIA.idGeneracion,
          tipoEjercicio: ejercicio.generacionIA.tipoEjercicio,
          dificultad: ejercicio.generacionIA.dificultad,
          contextoAdicional: ejercicio.generacionIA.contextoAdicional,
          contenidos: ejercicio.generacionIA.contenidos.map((c) => c.contenido),
        }
      : null,
    resolucionDocente: ejercicio.resolucion
      ? {
          idResolucion: ejercicio.resolucion.idResolucion,
          estado: ejercicio.resolucion.estado,
        }
      : null,
    progresoEntregas: {
      totalAlumnos,
      entregasCorregidas: 0,
      entregasPendientes: 0,
      sinEntregar: totalAlumnos,
      porcentajeEntrega: 0,
    },
    createdAt: ejercicio.createdAt.toISOString(),
    updatedAt: ejercicio.updatedAt.toISOString(),
  };
}

export function toResolucionDocenteResponse(
  ejercicio: EjercicioResolucionEntity
): ResolucionDocenteResponseDTO {
  const plantillasResolucion = ejercicio.resolucion?.plantillas ?? [];

  return {
    idResolucion: ejercicio.resolucion?.idResolucion ?? 0,
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    enunciado: ejercicio.enunciado,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    estado: ejercicio.resolucion?.estado ?? 'PENDIENTE',
    plantillas: ejercicio.plantillas.map((plantilla) => {
      const resolucionPlantilla = plantillasResolucion.find(
        (rp) => rp.ejercicioPlantillaId === plantilla.idEjercicioPlantilla
      );

      return {
        idEjercicioPlantilla: plantilla.idEjercicioPlantilla,
        tipo: plantilla.tipo,
        estado: resolucionPlantilla?.estado ?? 'PENDIENTE',
        contenido: resolucionPlantilla?.contenido ?? null,
      };
    }),
  };
}
