import { EstadoResolucionEjercicio } from '@prisma/client';
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
  ResolucionDocenteResponseDTO,
} from '../dto/ejercicio/ejercicio.dto';

import {
  ActualizarResolucionDocenteBodyDTO,
  CrearEjercicioDTO,
  EditarEjercicioBodyDTO,
  GenerarEjercicioDTO,
  ObtenerEjerciciosQueryDTO,
} from '../validators/ejercicio.validator';

import {
  validarBalanceLibroDiario,
  validarBalanceLibroMayor,
  validarBalanceLibroIva,
  validarBalanceHojaTrabajo,
} from '../validators/resolucion-plantillas.validator';

import {
  toDetalleEjercicioResponse,
  toEjercicioCreadoResponse,
  toListadoEjerciciosResponse,
  toResolucionDocenteResponse,
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

export async function editarEjercicio(
  user: AuthUser,
  idEjercicio: number,
  dto: EditarEjercicioBodyDTO
): Promise<DetalleEjercicioResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicio por ID
  const ejercicio = await ejercicioRepository.findEjercicioByIdOrThrow(idEjercicio);

  // 3. Validar autoría
  if (ejercicio.docenteId !== docente.id) {
    throw new ForbiddenError('No tienes permisos para modificar este ejercicio.');
  }

  // 4. Validar pertenencia al curso actual
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(ejercicio.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso al que pertenece este ejercicio.');
  }

  // 5. Validar reglas según estado
  if (ejercicio.estado === 'FINALIZADO') {
    throw new BadRequestError('No se puede editar un ejercicio finalizado.');
  }

  if (ejercicio.estado === 'PUBLICADO') {
    if (
      dto.titulo !== undefined ||
      dto.enunciado !== undefined ||
      dto.cursoId !== undefined ||
      dto.plantillas !== undefined ||
      (dto.estado !== undefined && dto.estado !== 'ENVIADO')
    ) {
      throw new BadRequestError(
        'En estado ENVIADO sólo se permite modificar la fecha límite y las indicaciones.'
      );
    }
  }

  // 6. Si es BORRADOR y cambia el curso, validar que el nuevo curso exista y el docente tenga permisos
  if (dto.cursoId !== undefined && dto.cursoId !== ejercicio.cursoId) {
    await cursoRepository.findByIdOrThrow(dto.cursoId);
    if (!cursosDocente.includes(dto.cursoId)) {
      throw new ForbiddenError('No tienes permisos sobre el nuevo curso especificado.');
    }
  }

  // 7. Si se actualiza fecha límite, validar que sea futura
  let fechaLimiteParsed: Date | undefined;
  if (dto.fechaLimite !== undefined) {
    fechaLimiteParsed = new Date(dto.fechaLimite);
    if (isNaN(fechaLimiteParsed.getTime())) {
      throw new BadRequestError('La fecha límite no es una fecha válida.');
    }
    if (fechaLimiteParsed <= new Date()) {
      throw new BadRequestError('La fecha límite debe ser posterior a la fecha y hora actual.');
    }
  }

  // 8. Si se pasa a ENVIADO desde BORRADOR, validar que la fecha límite resultante sea futura
  if (dto.estado === 'ENVIADO' && ejercicio.estado === 'BORRADOR') {
    const fechaVerificar = fechaLimiteParsed ?? ejercicio.fechaLimite;
    if (fechaVerificar <= new Date()) {
      throw new BadRequestError(
        'Para enviar el ejercicio, la fecha límite debe ser posterior a la fecha y hora actual.'
      );
    }
  }

  // 9. Construir payload de actualización
  const dataActualizar: ejercicioRepository.ActualizarEjercicioData = {
    titulo: dto.titulo,
    enunciado: dto.enunciado,
    cursoId: dto.cursoId,
    fechaLimite: fechaLimiteParsed,
    indicaciones: dto.indicaciones,
    estado: dto.estado === 'ENVIADO' ? 'PUBLICADO' : dto.estado,
    plantillas: dto.plantillas,
  };

  // 10. Persistir actualización
  const ejercicioActualizado = await ejercicioRepository.actualizarEjercicio(
    idEjercicio,
    dataActualizar
  );

  // 10. Consultar cantidad de alumnos del curso resultante
  const totalAlumnos = await alumnoRepository.countByCursoId(ejercicioActualizado.cursoId);

  // 11. Mapear y retornar la respuesta
  return toDetalleEjercicioResponse(ejercicioActualizado, totalAlumnos);
}

export async function duplicarEjercicio(
  user: AuthUser,
  idEjercicio: number
): Promise<EjercicioCreadoResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicio original por ID
  const ejercicio = await ejercicioRepository.findEjercicioByIdOrThrow(idEjercicio);

  // 3. Validar autoría
  if (ejercicio.docenteId !== docente.id) {
    throw new ForbiddenError('No tienes permisos para duplicar este ejercicio.');
  }

  // 4. Validar pertenencia al curso
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(ejercicio.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso al que pertenece este ejercicio.');
  }

  // 5. Preparar datos clonados
  const nuevoTitulo = `${ejercicio.titulo} (Copia)`.slice(0, 100);

  const ahora = new Date();
  const finDeAñoActual = new Date(ahora.getFullYear(), 11, 31, 23, 59, 59, 999);
  const fechaLimite = ejercicio.fechaLimite > ahora ? ejercicio.fechaLimite : finDeAñoActual;

  // 6. Persistir clon en estado BORRADOR reutilizando crearEjercicio
  const ejercicioClonado = await ejercicioRepository.crearEjercicio(
    docente.id,
    {
      titulo: nuevoTitulo,
      enunciado: ejercicio.enunciado,
      cursoId: ejercicio.cursoId,
      fechaLimite: fechaLimite.toISOString(),
      indicaciones: ejercicio.indicaciones,
      estado: 'BORRADOR',
      plantillas: ejercicio.plantillas.map((p) => p.tipo),
      generacionIA: ejercicio.generacionIA
        ? {
            tipoEjercicio: ejercicio.generacionIA.tipoEjercicio,
            dificultad: ejercicio.generacionIA.dificultad,
            contextoAdicional: ejercicio.generacionIA.contextoAdicional,
            contenidos: ejercicio.generacionIA.contenidos.map((c) => c.contenido),
          }
        : null,
    },
    fechaLimite
  );

  // 7. Mapear y retornar la respuesta
  return toEjercicioCreadoResponse(ejercicioClonado);
}

export async function consultarResolucionDocente(
  user: AuthUser,
  idEjercicio: number
): Promise<ResolucionDocenteResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicio con su resolución por ID
  const ejercicio = await ejercicioRepository.findEjercicioConResolucionByIdOrThrow(idEjercicio);

  // 3. Validar que el ejercicio pertenezca al docente autenticado
  if (ejercicio.docenteId !== docente.id) {
    throw new ForbiddenError('No tienes permisos para acceder a este ejercicio.');
  }

  // 4. Validar que el docente tenga asignado el curso del ejercicio
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(ejercicio.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso al que pertenece este ejercicio.');
  }

  // 5. Mapear y retornar la respuesta
  return toResolucionDocenteResponse(ejercicio);
}

export async function guardarResolucionDocente(
  user: AuthUser,
  idEjercicio: number,
  dto: ActualizarResolucionDocenteBodyDTO
): Promise<ResolucionDocenteResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicio con su resolución por ID
  const ejercicio = await ejercicioRepository.findEjercicioConResolucionByIdOrThrow(idEjercicio);

  // 3. Validar que el ejercicio pertenezca al docente autenticado
  if (ejercicio.docenteId !== docente.id) {
    throw new ForbiddenError('No tienes permisos para modificar la resolución de este ejercicio.');
  }

  // 4. Validar que el docente tenga asignado el curso del ejercicio
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(ejercicio.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso al que pertenece este ejercicio.');
  }

  // 5. Validar que la plantilla esté habilitada en este ejercicio
  const plantillaHabilitada = ejercicio.plantillas.find((p) => p.tipo === dto.tipo);
  if (!plantillaHabilitada) {
    throw new BadRequestError(
      `La plantilla ${dto.tipo} no se encuentra habilitada en este ejercicio.`
    );
  }

  const estadoPlantilla = dto.estado ?? 'EN_EDICION';

  if (estadoPlantilla === 'RESUELTO') {
    switch (dto.tipo) {
      case 'LIBRO_DIARIO':
        validarBalanceLibroDiario(dto.contenido);
        break;
      case 'LIBRO_MAYOR':
        validarBalanceLibroMayor(dto.contenido);
        break;
      case 'LIBRO_IVA':
        validarBalanceLibroIva(dto.contenido);
        break;
      case 'HOJA_TRABAJO':
        validarBalanceHojaTrabajo(dto.contenido);
        break;
    }
  }

  const plantillaActualizar = {
    idEjercicioPlantilla: plantillaHabilitada.idEjercicioPlantilla,
    estado: estadoPlantilla as EstadoResolucionEjercicio,
    contenido: dto.contenido,
  };

  // 6. Determinar estado de la cabecera ResolucionDocente
  const estadosFinalesPorPlantilla = new Map<number, string>();
  for (const rp of ejercicio.resolucion?.plantillas ?? []) {
    estadosFinalesPorPlantilla.set(rp.ejercicioPlantillaId, rp.estado);
  }
  estadosFinalesPorPlantilla.set(
    plantillaActualizar.idEjercicioPlantilla,
    plantillaActualizar.estado
  );

  const todasCompletadas = ejercicio.plantillas.every(
    (p) => estadosFinalesPorPlantilla.get(p.idEjercicioPlantilla) === 'RESUELTO'
  );

  let estadoResolucionGlobal: EstadoResolucionEjercicio | undefined;

  if (todasCompletadas) {
    estadoResolucionGlobal = 'RESUELTO';
  } else if (ejercicio.resolucion?.estado === 'PENDIENTE' || dto.estado === 'EN_EDICION') {
    estadoResolucionGlobal = 'EN_EDICION';
  }

  // 7. Persistir en la base de datos a través del repositorio
  const ejercicioActualizado = await ejercicioRepository.actualizarResolucionDocente(idEjercicio, {
    estado: estadoResolucionGlobal,
    plantilla: plantillaActualizar,
  });

  // 8. Mapear y retornar la respuesta consolidada
  return toResolucionDocenteResponse(ejercicioActualizado);
}
