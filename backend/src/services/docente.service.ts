import * as keycloakAdminService from './keycloak-admin.service';
import * as rolSistemaRepository from '../repositories/rol-sistema.repository';
import * as cursoRepository from '../repositories/curso.repository';
import * as docenteRepository from '../repositories/docente.repository';

import { ROLES } from '../constants/roles';
import { AuthUser } from '../types/express';

export async function crearDocente(data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  cursoIds: number[];
}) {
  let keycloakId: string | undefined;

  try {
    keycloakId = await keycloakAdminService.createUser({
      username: data.email,
      email: data.email,
      firstName: data.nombre,
      lastName: data.apellido,
      password: data.password,
    });

    await keycloakAdminService.removeUserFromGroup(keycloakId, 'Grupo_Alumnos');

    await keycloakAdminService.assignRealmRole(keycloakId, ROLES.DOCENTE);

    const rolSistema = await rolSistemaRepository.findDocente();

    if (!rolSistema) {
      throw new Error(`No existe el rol ${ROLES.DOCENTE} en la BD`);
    }

    // Validar que todos los cursos existan
    const cursos = await cursoRepository.findByIds(data.cursoIds);

    if (cursos.length !== data.cursoIds.length) {
      throw new Error('Uno o más cursos no existen');
    }

    // Crear usuario y asignar cursos en una transacción
    const usuario = await docenteRepository.crearDocente(
      keycloakId,
      data.email,
      data.nombre,
      data.apellido,
      rolSistema.idRol,
      data.cursoIds
    );

    console.info(`[DOCENTE] Creado ${usuario.email} con ${data.cursoIds.length} curso(s)`);

    return usuario;
  } catch (error) {
    if (keycloakId) {
      try {
        await keycloakAdminService.deleteUser(keycloakId);

        console.warn(`[ROLLBACK] Usuario ${keycloakId} eliminado de Keycloak`);
      } catch (rollbackError) {
        console.error('[ROLLBACK] Error eliminando usuario', rollbackError);
      }
    }

    throw error;
  }
}

export async function obtenerDocenteActual(user: AuthUser) {
  const docente = await docenteRepository.findByKeycloakId(user.keycloakId);

  if (!docente) {
    throw new Error('Docente no encontrado');
  }

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
