import { EjercicioCreadoResponseDTO } from './ejercicio.dto';
import { EjercicioCreadoEntity } from '../../repositories/ejercicio.repository';

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
