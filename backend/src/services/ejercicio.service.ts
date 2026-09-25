import { AuthUser } from '../types/express';

import {
  OPCIONES_TIPOS_EJERCICIO,
  OPCIONES_DIFICULTADES,
  OPCIONES_CONTENIDOS_ADICIONALES,
} from '../constants/ejercicio.constants';

import { ocrService } from '../integrations/ocr/ocr.service';
import { generacionService } from '../integrations/generacion/generacion.service';

import * as cursoRepository from '../repositories/curso.repository';
import * as docenteRepository from '../repositories/docente.repository';

import { BadRequestError } from '../errors/bad-request-error';
import { ForbiddenError } from '../errors/forbidden.error';

import {
  DigitalizarEjercicioResponseDTO,
  GenerarEjercicioResponseDTO,
  OpcionesGeneracionResponseDTO,
} from '../dto/ejercicio/ejercicio.dto';

import { GenerarEjercicioDTO } from '../validators/ejercicio.validator';

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
