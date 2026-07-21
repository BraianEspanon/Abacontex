import { DocenteActualResponseDTO } from './doc-actual.dto';
import { DocenteActualEntity } from '../../repositories/docente.repository';

export function toDocenteActualResponse(docente: DocenteActualEntity): DocenteActualResponseDTO {
  return {
    id: docente.id,
    nombre: docente.nombre,
    apellido: docente.apellido,
    email: docente.email,

    cursos: docente.profesorCursos.map((p) => ({
      id: p.curso.idCurso,
      nombre: p.curso.nombreCurso,
    })),
  };
}
