import { AuthUser } from '../types/express';

import { CompletarRegistroDTO } from '../validators/alumno.validator';
import { UsuarioActualResponseDTO } from '../dto/alumno/alu-actual.dto';
import { toAlumnoActualResponse } from '../dto/alumno/alu.mapper';

import * as alumnoRepository from '../repositories/alumno.repository';
import * as usuarioRepository from '../repositories/usuario.repository';
import * as cursoRepository from '../repositories/curso.repository';
import * as rolEmpresaRepository from '../repositories/rol-empresa.repository';

import { ConflictError } from '../errors/conflict.error';

export async function getAlumnoActual(user: AuthUser): Promise<UsuarioActualResponseDTO> {
  const usuario = await alumnoRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  return toAlumnoActualResponse(usuario);
}

export async function completarRegistro(user: AuthUser, data: CompletarRegistroDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithAlumnoOrThrow(user.keycloakId);

  if (usuario.alumno) {
    throw new ConflictError('El registro del alumno ya fue completado previamente.');
  }

  //con un await Promise.all se puede optimizar un poco acá
  await cursoRepository.findByIdOrThrow(data.idCurso);
  await rolEmpresaRepository.findByIdOrThrow(data.idRolEmpresa);

  await alumnoRepository.create(usuario.id, data);

  return getAlumnoActual(user);
}
