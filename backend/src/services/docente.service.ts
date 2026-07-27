import * as rolSistemaRepository from '../repositories/rol-sistema.repository';
import * as cursoRepository from '../repositories/curso.repository';
import * as docenteRepository from '../repositories/docente.repository';
import * as empresaRepository from '../repositories/empresa.repository';
import * as alumnoRepository from '../repositories/alumno.repository';
import * as emailService from '../integrations/email/email.service';
import * as keycloakAdminService from '../integrations/keycloak/keycloak-admin.service';

import { ROLES } from '../constants/roles';
import { AuthUser } from '../types/express';
import {
  DashboardDocenteDTO,
  /*DashboardDocenteFiltrosDTO,*/
  DashboardResumenDTO,
  ActividadRecienteDTO,
  AlumnoRiesgoDTO,
  RankingEmpresaDTO,
  ParticipacionCursoDTO,
  CorreccionPendienteDTO,
  AlertaDTO,
  EvolucionPuntajeDTO,
} from '../dto/docente/doc-dashboard.dto';
import { CursoDocenteDTO } from '../dto/docente/doc-curso.dto';
import {
  ActualizarCursosDocenteDTO,
  AlumnoDocenteFiltrosDTO,
  CrearDocenteDTO,
  EmpresaDocenteFiltrosDTO,
} from '../validators/docente.validator';
import { EmpresaDetalleDocenteDTO } from '../dto/docente/doc-empresa-detalle.dto';
import { EmpresasDocenteResponseDTO } from '../dto/docente/doc-empresa.dto';
import { AlumnosDocenteResponseDTO } from '../dto/docente/doc-alumno.dto';
import { toDocenteActualResponse } from '../dto/docente/doc.mapper';

import { NotFoundError } from '../errors/not-found.error';
import { DocenteActualResponseDTO } from '../dto/docente/doc-actual.dto';

export async function crearDocente(data: CrearDocenteDTO) {
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

    const rolSistema = await rolSistemaRepository.findDocenteOrThrow();

    // Validar que todos los cursos existan
    const cursos = await cursoRepository.findByIds(data.cursoIds);

    if (cursos.length !== data.cursoIds.length) {
      throw new NotFoundError('Uno o más cursos no existen');
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
    try {
      await emailService.sendWelcomeEmail(usuario.email, usuario.nombre);
      console.info(`[EMAIL] Correo de bienvenida enviado a ${usuario.email}`);
    } catch (error) {
      console.error(`[EMAIL] No se pudo enviar el correo de bienvenida a ${usuario.email}`, error);
    }

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
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  return toDocenteActualResponse(docente);
}

export async function actualizarCursosDocenteActual(
  user: AuthUser,
  data: ActualizarCursosDocenteDTO
): Promise<DocenteActualResponseDTO> {
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  await cursoRepository.findByIdsOrThrow(data.cursoIds);

  await docenteRepository.updateCursosProfesor(docente.id, data.cursoIds);

  return obtenerDocenteActual(user);
}

export async function obtenerDashboard(
  user: AuthUser
  /*
  filtros: DashboardDocenteFiltrosDTO
  */
): Promise<DashboardDocenteDTO> {
  const resumen = await obtenerResumen(user /*, filtros*/);

  const evolucionPuntaje = await obtenerEvolucionPuntaje(/*user, filtros*/);

  const actividadReciente = await obtenerActividadReciente(/*user, filtros*/);

  const alumnosRiesgo = await obtenerAlumnosRiesgo(/*user, filtros*/);

  const ranking = await obtenerRankingEmpresas(/*user, filtros*/);

  const participacion = await obtenerParticipacionCursos(/*user, filtros*/);

  const correcciones = await obtenerCorreccionesPendientes(/*user, filtros*/);

  const alertas = await obtenerAlertas(/*user, filtros*/);

  return {
    resumen,
    evolucionPuntaje,
    actividadReciente,
    alumnosRiesgo,
    ranking,
    participacion,
    correcciones,
    alertas,
  };
}

async function obtenerResumen(
  user: AuthUser
  /*
  filtros: DashboardDocenteFiltrosDTO
  */
): Promise<DashboardResumenDTO> {
  const cursoIds = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);

  const cursosActivos = cursoIds.length;

  const empresasActivas = await empresaRepository.countByCursos(cursoIds);

  const alumnos = await alumnoRepository.countByCursos(cursoIds);

  return {
    cursosActivos,
    empresasActivas,
    alumnos,
    ejerciciosPendientes: 0,
    puntajePromedio: null,
  };
}
async function obtenerEvolucionPuntaje(): Promise<EvolucionPuntajeDTO[]> {
  /*
  user: AuthUser,
  filtros: DashboardDocenteFiltrosDTO
  */
  return [];
}

async function obtenerActividadReciente(): Promise<ActividadRecienteDTO[]> {
  /*
  user: AuthUser,
  filtros: DashboardDocenteFiltrosDTO
  */
  return [];
}

async function obtenerAlumnosRiesgo(): Promise<AlumnoRiesgoDTO[]> {
  /*
  user: AuthUser,
  filtros: DashboardDocenteFiltrosDTO
  */
  return [];
}

async function obtenerRankingEmpresas(): Promise<RankingEmpresaDTO[]> {
  /*
  user: AuthUser,
  filtros: DashboardDocenteFiltrosDTO
  */
  return [];
}

async function obtenerParticipacionCursos(): Promise<ParticipacionCursoDTO[]> {
  /*
  user: AuthUser,
  filtros: DashboardDocenteFiltrosDTO
  */
  return [];
}

async function obtenerCorreccionesPendientes(): Promise<CorreccionPendienteDTO[]> {
  /*
  user: AuthUser,
  filtros: DashboardDocenteFiltrosDTO
  */
  return [];
}

async function obtenerAlertas(): Promise<AlertaDTO[]> {
  /*
  user: AuthUser,
  filtros: DashboardDocenteFiltrosDTO
  */
  return [];
}

export async function obtenerCursos(user: AuthUser): Promise<CursoDocenteDTO[]> {
  const cursos = await docenteRepository.findCursosByDocente(user.keycloakId);

  const resultado: CursoDocenteDTO[] = [];

  for (const curso of cursos) {
    const empresasActivas = await empresaRepository.countByCurso(curso.idCurso);

    const alumnos = await alumnoRepository.countByCurso(curso.idCurso);

    resultado.push({
      id: curso.idCurso,

      nombre: curso.nombreCurso,

      empresasActivas,

      alumnos,

      participacionPromedio: null,

      puntajePromedioEmpresarial: null,

      ultimaActividad: null,
    });
  }

  return resultado;
}
export async function obtenerEmpresas(
  user: AuthUser,
  filtros: EmpresaDocenteFiltrosDTO
): Promise<EmpresasDocenteResponseDTO> {
  const { totalItems, items } = await empresaRepository.findByDocente(
    user.keycloakId,
    filtros.search,
    filtros.cursoId,
    filtros.page,
    filtros.pageSize
  );

  return {
    resumen: {
      total: totalItems,
      activas: null,
      inactivas: null,
    },

    items: items.map((empresa) => ({
      id: empresa.id,

      nombre: empresa.nombre,

      actividad: empresa.actividad,

      logoUrl: empresa.logoUrl,

      activa: null,

      idCurso: empresa.curso.idCurso,

      curso: empresa.curso.nombreCurso,

      cantidadIntegrantes: empresa.alumnos.length,

      contactos: empresa.alumnos.map((alumno) => alumno.usuario.email),
    })),

    page: filtros.page,

    pageSize: filtros.pageSize,

    totalItems,

    totalPages: Math.ceil(totalItems / filtros.pageSize),
  };
}

export async function obtenerDetalleEmpresaDocente(
  user: AuthUser,
  empresaId: number
): Promise<EmpresaDetalleDocenteDTO> {
  const empresa = await empresaRepository.findDetalleByDocente(user.keycloakId, empresaId);

  if (!empresa) {
    throw new Error('Empresa no encontrada');
  }

  return {
    id: empresa.id,

    nombre: empresa.nombre,

    actividad: empresa.actividad,

    logoUrl: empresa.logoUrl,

    activa: null,
    fechaCreacion: null,

    idCurso: empresa.curso.idCurso,

    curso: empresa.curso.nombreCurso,

    cantidadIntegrantes: empresa.alumnos.length,

    contactos: empresa.alumnos.map((alumno) => alumno.usuario.email),

    integrantes: empresa.alumnos.map((alumno) => ({
      id: alumno.usuario.id,
      nombre: alumno.usuario.nombre,
      apellido: alumno.usuario.apellido,
      email: alumno.usuario.email,
      rolEmpresa: alumno.rolEmpresa?.nombreRol ?? null,
    })),
  };
}

export async function obtenerAlumnos(
  user: AuthUser,
  filtros: AlumnoDocenteFiltrosDTO
): Promise<AlumnosDocenteResponseDTO> {
  const { resumen, totalItems, items } = await alumnoRepository.findByDocente(
    user.keycloakId,
    filtros
  );

  return {
    resumen,

    totalItems,

    page: filtros.page,

    pageSize: filtros.pageSize,

    totalPages: Math.ceil(totalItems / filtros.pageSize),

    items: items.map((alumno) => ({
      id: alumno.usuario.id,

      fotoPerfilUrl: alumno.usuario.fotoPerfilUrl,

      nombre: alumno.usuario.nombre,

      apellido: alumno.usuario.apellido,

      email: alumno.usuario.email,

      curso: alumno.curso.nombreCurso,

      empresa: alumno.empresa?.nombre ?? null,

      participacion: null,

      ejerciciosRealizados: null,

      ultimaActividad: null,

      estado: null,
    })),
  };
}
