import { SimulacionCreadaEntity } from '../../repositories/simulacion.repository';
import { SimulacionCreadaResponseDTO } from './simulacion.dto';

export function toSimulacionCreadaResponse(
  simulacion: SimulacionCreadaEntity,
  empresasParticipantes: number
): SimulacionCreadaResponseDTO {
  return {
    idSimulacion: simulacion.idSimulacion,
    titulo: simulacion.titulo,
    flujoEmpresarial: simulacion.flujoEmpresarial,
    dificultad: simulacion.dificultad,
    duracion: simulacion.duracion,
    eventosSorpresa: simulacion.eventosSorpresa,
    usarDatosEmpresa: simulacion.usarDatosEmpresa,
    fechaLimite: simulacion.fechaLimite.toISOString(),
    estado: simulacion.estado,
    curso: {
      idCurso: simulacion.curso.idCurso,
      nombreCurso: simulacion.curso.nombreCurso,
      año: simulacion.curso.año,
    },
    empresasParticipantes,
    createdAt: simulacion.createdAt.toISOString(),
    updatedAt: simulacion.updatedAt.toISOString(),
  };
}
