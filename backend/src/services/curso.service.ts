import { AuthUser } from '../types/express';
import { ROLES } from '../constants/roles';
import * as cursoRepository from '../repositories/curso.repository';

export async function getCursos() {
  return cursoRepository.findAll();
}

export async function getMisCursos(user: AuthUser) {
  if (user.roles.includes(ROLES.DOCENTE)) {
    return cursoRepository.findCursosByDocente(user.keycloakId);
  }

  if (user.roles.includes(ROLES.ALUMNO)) {
    return cursoRepository.findCursoByAlumno(user.keycloakId);
  }

  return cursoRepository.findCursosConAño();
}
