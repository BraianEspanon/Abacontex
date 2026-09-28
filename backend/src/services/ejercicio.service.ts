import { AuthUser } from '../types/express';

import {
  OPCIONES_TIPOS_EJERCICIO,
  OPCIONES_DIFICULTADES,
  OPCIONES_CONTENIDOS_ADICIONALES,
} from '../constants/ejercicio.constants';

import { ocrService } from '../integrations/ocr/ocr.service';
import { generacionService } from '../integrations/generacion/generacion.service';

import * as alumnoRepository from '../repositories/alumno.repository';
import * as cursoRepository from '../repositories/curso.repository';
import * as docenteRepository from '../repositories/docente.repository';
import * as ejercicioRepository from '../repositories/ejercicio.repository';

import { BadRequestError } from '../errors/bad-request-error';
import { ForbiddenError } from '../errors/forbidden.error';

import {
  DetalleEjercicioResponseDTO,
  DigitalizarEjercicioResponseDTO,
  EjercicioCreadoResponseDTO,
  GenerarEjercicioResponseDTO,
  ListadoEjerciciosResponseDTO,
  OpcionesGeneracionResponseDTO,
} from '../dto/ejercicio/ejercicio.dto';

import {
  CrearEjercicioDTO,
  GenerarEjercicioDTO,
  ObtenerEjerciciosQueryDTO,
} from '../validators/ejercicio.validator';

import {
  toDetalleEjercicioResponse,
  toEjercicioCreadoResponse,
  toListadoEjerciciosResponse,
} from '../dto/ejercicio/ejercicio.mapper';

export function obtenerOpcionesGeneracion(): OpcionesGeneracionResponseDTO {
  return {
    tiposEjercicio: OPCIONES_TIPOS_EJERCICIO,
    dificultades: OPCIONES_DIFICULTADES,
    contenidosAdicionales: OPCIONES_CONTENIDOS_ADICIONALES,
  };
}

export async function digitalizarEjercicio(
  file?: Express.Multer.File
): Promise<DigitalizarEjercicioResponseDTO> {
  // 1. Validar presencia del archivo adjunto
  if (!file || !file.buffer) {
    throw new BadRequestError('Debe adjuntar un archivo de imagen o PDF para digitalizar.');
  }

  // 2. Validar que el archivo contenga datos
  if (file.size === 0) {
    throw new BadRequestError('El archivo adjunto se encuentra vacío.');
  }

  // 3. Coordinar la digitalización con el proveedor de OCR
  const resultado = await ocrService.extraerTexto(file.buffer, file.mimetype);

  // 4. Retornar el DTO con el enunciado en Markdown
  return {
    enunciadoTexto: resultado.enunciadoTexto,
  };
}

export async function generarEjercicio(
  dto: GenerarEjercicioDTO,
  user: AuthUser
): Promise<GenerarEjercicioResponseDTO> {
  // 1. Validar existencia del curso en DB
  const curso = await cursoRepository.findByIdOrThrow(dto.cursoId);

  // 2. Validar que el docente autenticado tenga acceso al curso especificado
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(dto.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso especificado.');
  }

  // 3. Coordinar la generación del enunciado con el proveedor de IA
  const resultado = await generacionService.generarEnunciado({
    cursoAño: curso.año,
    tipoEjercicio: dto.tipoEjercicio,
    dificultad: dto.dificultad,
    contenidosAdicionales: dto.contenidosAdicionales,
    contextoAdicional: dto.contextoAdicional,
  });

  // 4. Retornar el DTO con el enunciado generado
  return {
    enunciadoTexto: resultado.enunciadoTexto,
  };
}

export async function crearEjercicio(
  user: AuthUser,
  dto: CrearEjercicioDTO
): Promise<EjercicioCreadoResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Validar existencia del curso en DB
  await cursoRepository.findByIdOrThrow(dto.cursoId);

  // 3. Validar que el docente autenticado tenga acceso al curso especificado
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(dto.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso especificado.');
  }

  // 4. Validar que la fecha límite sea una fecha válida y posterior a la actual
  const fechaLimite = new Date(dto.fechaLimite);
  if (isNaN(fechaLimite.getTime())) {
    throw new BadRequestError('La fecha límite no es una fecha válida.');
  }

  const ahora = new Date();
  if (fechaLimite <= ahora) {
    throw new BadRequestError('La fecha límite debe ser posterior a la fecha y hora actual.');
  }

  // 5. Persistir el ejercicio con sus relaciones asociadas en el repositorio
  const ejercicio = await ejercicioRepository.crearEjercicio(docente.id, dto, fechaLimite);

  // 6. Retornar el DTO desacoplado
  return toEjercicioCreadoResponse(ejercicio);
}

export async function obtenerEjercicios(
  user: AuthUser,
  query: ObtenerEjerciciosQueryDTO
): Promise<ListadoEjerciciosResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Si se solicitó filtrar por curso, validar que el docente tenga acceso a dicho curso
  if (query.cursoId) {
    const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
    if (!cursosDocente.includes(query.cursoId)) {
      throw new ForbiddenError('No tienes permisos sobre el curso especificado.');
    }
  }

  // 3. Consultar los ejercicios paginados y las métricas de resumen
  const resultado = await ejercicioRepository.findEjerciciosByDocente(docente.id, query);

  // 4. Mapear y retornar la respuesta plana con resumen
  return toListadoEjerciciosResponse(
    resultado.items,
    resultado.totalItems,
    query.page ?? 1,
    query.pageSize ?? 6,
    resultado.resumen
  );
}

export async function obtenerEjercicioPorId(
  user: AuthUser,
  idEjercicio: number
): Promise<DetalleEjercicioResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicio por ID
  const ejercicio = await ejercicioRepository.findEjercicioByIdOrThrow(idEjercicio);

  // 3. Validar que el ejercicio pertenezca al docente autenticado
  if (ejercicio.docenteId !== docente.id) {
    throw new ForbiddenError('No tienes permisos para acceder a este ejercicio.');
  }

  // 4. Validar que el docente tenga acceso al curso del ejercicio
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(ejercicio.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso al que pertenece este ejercicio.');
  }

  // 5. Consultar cantidad de alumnos del curso
  const totalAlumnos = await alumnoRepository.countByCursoId(ejercicio.cursoId);

  // 6. Mapear y retornar la respuesta
  return toDetalleEjercicioResponse(ejercicio, totalAlumnos);
}
