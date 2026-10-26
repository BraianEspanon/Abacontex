import { EstadoCorreccionPlantilla, Prisma } from '@prisma/client';
import { AuthUser } from '../types/express';
import { NotFoundError } from '../errors/not-found.error';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict.error';
import { emitirAUsuario } from '../socket/socket.server';

import * as docenteRepository from '../repositories/docente.repository';
import * as correccionRepository from '../repositories/correccion.repository';

import {
  FinalizarCorreccionBodyDTO,
  GuardarBorradorCorreccionBodyDTO,
  GuardarComentarioErrorBodyDTO,
  ObtenerEjerciciosACorregirQueryDTO,
  ObtenerEntregasEjercicioQueryDTO,
  RevisarPlantillaBodyDTO,
} from '../validators/correccion.validator';
import {
  OPCIONES_FILTRO_ESTADO_CORRECCION,
  OPCIONES_FILTRO_ESTADO_CORRECCION_ALUMNO,
} from '../constants/correccion.constants';
import {
  CabeceraEjercicioEntregasDTO,
  EspacioTrabajoCorreccionResponseDTO,
  FiltrosEntregasEjercicioDTO,
  ListadoEjerciciosACorregirResponseDTO,
  ListadoEntregasEjercicioResponseDTO,
  OpcionesFiltrosCorreccionResponseDTO,
  ResumenTableroCorreccionesDTO,
} from '../dto/correccion/correccion.dto';
import {
  formatearNombresPlantillas,
  toEspacioTrabajoCorreccionResponse,
  toItemAlumnoEntrega,
  toItemTableroCorreccion,
  toListadoEjerciciosACorregirResponse,
  toListadoEntregasEjercicioResponse,
} from '../dto/correccion/correccion.mapper';
import { compararResolucionConModelo } from '../utils/comparadores-plantillas';

export async function obtenerEjerciciosACorregir(
  user: AuthUser,
  query: ObtenerEjerciciosACorregirQueryDTO
): Promise<ListadoEjerciciosACorregirResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicios publicados del docente
  const ejercicios = await correccionRepository.findEjerciciosParaTableroCorreccion(docente.id, {
    busqueda: query.busqueda,
    cursoId: query.cursoId,
  });

  // 3. Mapear y calcular estados dinámicos por ejercicio
  const todosLosItems = ejercicios.map((ej) => toItemTableroCorreccion(ej));

  // 4. Calcular métricas de resumen para las cards superiores del tablero
  const resumen: ResumenTableroCorreccionesDTO = {
    total: todosLosItems.length,
    sinEntregas: todosLosItems.filter((i) => i.estado === 'SIN_ENTREGAS').length,
    pendientes: todosLosItems.filter((i) => i.estado === 'PENDIENTE').length,
    enCorreccion: todosLosItems.filter((i) => i.estado === 'EN_CORRECCION').length,
    corregidos: todosLosItems.filter((i) => i.estado === 'CORREGIDO').length,
  };

  // 5. Filtrar por estado si se especificó y no es 'TODAS'
  const itemsFiltrados =
    query.estado && query.estado !== 'TODAS'
      ? todosLosItems.filter((i) => i.estado === query.estado)
      : todosLosItems;

  // 6. Paginar en memoria
  const { page = 1, pageSize = 6 } = query;
  const skip = (page - 1) * pageSize;
  const itemsPaginados = itemsFiltrados.slice(skip, skip + pageSize);

  // 7. Retornar DTO paginado ensamblado
  return toListadoEjerciciosACorregirResponse(
    itemsPaginados,
    page,
    pageSize,
    itemsFiltrados.length,
    resumen
  );
}

export async function obtenerFiltrosTableroCorreccion(
  user: AuthUser
): Promise<OpcionesFiltrosCorreccionResponseDTO> {
  const cursos = await docenteRepository.findCursosByDocente(user.keycloakId);

  return {
    cursos: cursos.map((c) => ({
      idCurso: c.idCurso,
      nombreCurso: c.nombreCurso,
    })),
    estados: OPCIONES_FILTRO_ESTADO_CORRECCION.map((opcion) => ({
      clave: opcion.clave,
      label: opcion.label,
    })),
  };
}

export async function obtenerEntregasEjercicio(
  user: AuthUser,
  ejercicioId: number,
  query: ObtenerEntregasEjercicioQueryDTO
): Promise<ListadoEntregasEjercicioResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar ejercicio con alumnos del curso y sus entregas
  const ejercicio = await correccionRepository.findEjercicioConEntregasYAlumnos(
    ejercicioId,
    docente.id
  );

  if (!ejercicio) {
    throw new NotFoundError('Ejercicio no encontrado o no pertenece al docente.');
  }

  // 3. Cruzar todos los alumnos del curso con sus entregas
  const totalPlantillas = ejercicio.plantillas.length;
  const fechaLimite = ejercicio.fechaLimite;

  const todosLosItems = ejercicio.curso.alumnos.map((alumno) => {
    const entrega = ejercicio.entregas.find((e) => e.alumnoId === alumno.id);
    return toItemAlumnoEntrega(alumno, entrega, fechaLimite, totalPlantillas);
  });

  // 4. Calcular métricas de cabecera del ejercicio
  const totalAlumnos = todosLosItems.length;
  const totalEntregasRecibidas = todosLosItems.filter((i) => i.estado !== 'SIN_ENTREGAR').length;
  const entregasCorregidas = todosLosItems.filter((i) => i.estado === 'CORREGIDA').length;
  const entregasPendientes = todosLosItems.filter(
    (i) => i.estado === 'PENDIENTE' || i.estado === 'EN_CORRECCION'
  ).length;
  const cantidadSinEntregar = todosLosItems.filter((i) => i.estado === 'SIN_ENTREGAR').length;

  const cabecera: CabeceraEjercicioEntregasDTO = {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
    },
    plantillasHabilitadas: formatearNombresPlantillas(ejercicio.plantillas.map((p) => p.tipo)),
    totalAlumnos,
    totalEntregasRecibidas,
    entregasCorregidas,
    entregasPendientes,
    cantidadSinEntregar,
  };

  // 5. Opciones para los filtros de la pantalla
  const filtros: FiltrosEntregasEjercicioDTO = {
    estados: OPCIONES_FILTRO_ESTADO_CORRECCION_ALUMNO.map((o) => ({
      clave: o.clave,
      label: o.label,
    })),
  };

  // 6. Filtrar por búsqueda de alumno si se especificó
  let itemsFiltrados = todosLosItems;
  if (query.busqueda) {
    const termino = query.busqueda.toLowerCase();
    itemsFiltrados = itemsFiltrados.filter(
      (i) =>
        i.nombre.toLowerCase().includes(termino) ||
        i.apellido.toLowerCase().includes(termino) ||
        i.email.toLowerCase().includes(termino)
    );
  }

  // 7. Filtrar por estado de corrección si es distinto de 'TODAS'
  if (query.estado && query.estado !== 'TODAS') {
    itemsFiltrados = itemsFiltrados.filter((i) => i.estado === query.estado);
  }

  // 8. Paginación en memoria
  const { page = 1, pageSize = 10 } = query;
  const skip = (page - 1) * pageSize;
  const itemsPaginados = itemsFiltrados.slice(skip, skip + pageSize);

  // 9. Retornar DTO de respuesta
  return toListadoEntregasEjercicioResponse(
    itemsPaginados,
    page,
    pageSize,
    itemsFiltrados.length,
    cabecera,
    filtros
  );
}

export async function obtenerEspacioTrabajoCorreccion(
  user: AuthUser,
  entregaId: number
): Promise<EspacioTrabajoCorreccionResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar entrega para corrección verificando pertenencia
  const entrega = await correccionRepository.findEntregaParaEspacioTrabajo(entregaId, docente.id);

  if (!entrega) {
    throw new NotFoundError('Entrega no encontrada o no pertenece al docente.');
  }

  // 3. Preparar datos de plantillas para la comparación determinista en memoria
  const plantillasParaComparar = entrega.ejercicio.plantillas.map((ep) => {
    const resDoc = entrega.ejercicio.resolucion?.plantillas.find(
      (p) => p.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );
    const resAlu = entrega.resoluciones.find(
      (r) => r.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );
    const erroresPrevios = entrega.correccion?.errores.filter(
      (e) => e.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );

    return {
      ejercicioPlantillaId: ep.idEjercicioPlantilla,
      tipo: ep.tipo,
      contenidoDocente: resDoc?.contenido ?? null,
      contenidoAlumno: resAlu?.contenido ?? null,
      erroresPreviosDocente: (erroresPrevios ?? []).map((e) => ({
        idError: e.idError,
        ejercicioPlantillaId: e.ejercicioPlantillaId,
        tipoError: e.tipoError,
        detalle: e.detalle,
        comentarioDocente: e.comentarioDocente,
      })),
    };
  });

  // 4. Ejecutar motor de comparación determinista (< 20 ms)
  const resultadoComparacion = compararResolucionConModelo(plantillasParaComparar);

  // 5. Mapear y retornar respuesta estructurada
  return toEspacioTrabajoCorreccionResponse(entrega, resultadoComparacion);
}

export async function actualizarRevisionPlantilla(
  user: AuthUser,
  entregaId: number,
  plantillaId: number,
  body: RevisarPlantillaBodyDTO
) {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Buscar entrega y verificar pertenencia al docente
  const entrega = await correccionRepository.findEntregaParaRevisionPlantilla(entregaId);

  if (!entrega || entrega.ejercicio.docenteId !== docente.id) {
    throw new NotFoundError('Entrega no encontrada o no pertenece al docente.');
  }

  // 3. Validar que la entrega haya sido efectivamente realizada por el alumno
  if (!entrega.fechaEntrega) {
    throw new BadRequestError('La entrega aún no ha sido completada por el alumno.');
  }

  // 4. Validar que la corrección no haya sido finalizada previamente
  if (entrega.correccion?.fechaCorreccion) {
    throw new ConflictError(
      'La corrección de esta entrega ya ha sido finalizada y no puede modificarse.'
    );
  }

  // 5. Validar que la plantilla pertenezca al ejercicio de la entrega
  const plantillaExiste = entrega.ejercicio.plantillas.some(
    (p) => p.idEjercicioPlantilla === plantillaId
  );
  if (!plantillaExiste) {
    throw new NotFoundError('La plantilla especificada no pertenece al ejercicio de esta entrega.');
  }

  // 6. Traducir estado del contrato API ('PENDIENTE' | 'CORREGIDA') al enum de la BD ('PENDIENTE' | 'COMPLETADA')
  const estadoPrisma: EstadoCorreccionPlantilla =
    body.estado === 'CORREGIDA'
      ? EstadoCorreccionPlantilla.COMPLETADA
      : EstadoCorreccionPlantilla.PENDIENTE;

  // 7. Persistir estado de revisión de la plantilla
  const plantillaActualizada = await correccionRepository.upsertCorreccionPlantilla(
    entregaId,
    docente.id,
    plantillaId,
    estadoPrisma
  );

  return {
    idCorreccionPlantilla: plantillaActualizada.idCorreccionPlantilla,
    idEjercicioPlantilla: plantillaActualizada.ejercicioPlantillaId,
    estado: body.estado,
    mensaje:
      body.estado === 'CORREGIDA'
        ? 'Plantilla marcada como revisada.'
        : 'Plantilla marcada como pendiente de revisión.',
  };
}

export async function guardarBorradorCorreccion(
  user: AuthUser,
  entregaId: number,
  body: GuardarBorradorCorreccionBodyDTO
) {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Buscar entrega y verificar pertenencia al docente
  const entrega = await correccionRepository.findEntregaParaRevisionPlantilla(entregaId);

  if (!entrega || entrega.ejercicio.docenteId !== docente.id) {
    throw new NotFoundError('Entrega no encontrada o no pertenece al docente.');
  }

  // 3. Validar que la entrega haya sido completada por el alumno
  if (!entrega.fechaEntrega) {
    throw new BadRequestError('La entrega aún no ha sido completada por el alumno.');
  }

  // 4. Validar que la corrección no haya sido finalizada previamente
  if (entrega.correccion?.fechaCorreccion) {
    throw new ConflictError(
      'La corrección de esta entrega ya ha sido finalizada y no puede modificarse.'
    );
  }

  // 5. Sanitizar texto de retroalimentación
  const retroalimentacionLimpia = body.retroalimentacion?.trim() || null;

  // 6. Persistir borrador de retroalimentación
  const correccion = await correccionRepository.upsertBorradorCorreccion(
    entregaId,
    docente.id,
    retroalimentacionLimpia
  );

  return {
    idCorreccion: correccion.idCorreccion,
    entregaId: correccion.entregaId,
    retroalimentacion: correccion.retroalimentacion,
    mensaje: 'Borrador de retroalimentación guardado correctamente.',
  };
}

export async function finalizarCorreccion(
  user: AuthUser,
  entregaId: number,
  body: FinalizarCorreccionBodyDTO
) {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Buscar entrega para finalizar y verificar pertenencia al docente
  const entrega = await correccionRepository.findEntregaParaFinalizar(entregaId);

  if (!entrega || entrega.ejercicio.docenteId !== docente.id) {
    throw new NotFoundError('Entrega no encontrada o no pertenece al docente.');
  }

  // 3. Validar que la entrega haya sido completada por el alumno
  if (!entrega.fechaEntrega) {
    throw new BadRequestError('La entrega aún no ha sido completada por el alumno.');
  }

  // 4. Validar que la corrección no haya sido finalizada previamente
  if (entrega.correccion?.fechaCorreccion) {
    throw new ConflictError(
      'La corrección de esta entrega ya ha sido finalizada y no puede modificarse.'
    );
  }

  // 5. Validación de completitud obligatoria:
  // Todas las plantillas habilitadas del ejercicio deben estar marcadas como COMPLETADA (CORREGIDA)
  const plantillasHabilitadas = entrega.ejercicio.plantillas;
  const plantillasCorregidas = entrega.correccion?.plantillas ?? [];

  const faltanCorregir = plantillasHabilitadas.filter((ph) => {
    const revision = plantillasCorregidas.find(
      (p) => p.ejercicioPlantillaId === ph.idEjercicioPlantilla
    );
    return !revision || revision.estado !== EstadoCorreccionPlantilla.COMPLETADA;
  });

  if (faltanCorregir.length > 0) {
    throw new ConflictError('Debe marcar todas las plantillas como corregidas antes de enviar.');
  }

  // 6. Ejecutar motor de comparación determinista para calcular errores finales
  const plantillasParaComparar = entrega.ejercicio.plantillas.map((ep) => {
    const resDoc = entrega.ejercicio.resolucion?.plantillas.find(
      (p) => p.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );
    const resAlu = entrega.resoluciones.find(
      (r) => r.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );
    const erroresPrevios = entrega.correccion?.errores.filter(
      (e) => e.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );

    return {
      ejercicioPlantillaId: ep.idEjercicioPlantilla,
      tipo: ep.tipo,
      contenidoDocente: resDoc?.contenido ?? null,
      contenidoAlumno: resAlu?.contenido ?? null,
      erroresPreviosDocente: (erroresPrevios ?? []).map((e) => ({
        idError: e.idError,
        ejercicioPlantillaId: e.ejercicioPlantillaId,
        tipoError: e.tipoError,
        detalle: e.detalle,
        comentarioDocente: e.comentarioDocente,
      })),
    };
  });

  const resultadoComparacion = compararResolucionConModelo(plantillasParaComparar);

  // 7. Aplanar lista de errores contables definitivos para persistencia
  const erroresAPersistir: correccionRepository.ErrorParaPersistirData[] = [];
  for (const [, errores] of resultadoComparacion.erroresPorPlantilla) {
    for (const err of errores) {
      erroresAPersistir.push({
        ejercicioPlantillaId: err.ejercicioPlantillaId,
        tipoError: err.tipoError,
        detalle: err.detalle as Prisma.InputJsonValue,
        comentarioDocente: err.comentarioDocente ?? null,
      });
    }
  }

  // 8. Determinar retroalimentación definitiva (body si fue enviada, o el borrador existente)
  const retroalimentacionFinal =
    body.retroalimentacion !== undefined
      ? body.retroalimentacion.trim() || null
      : (entrega.correccion?.retroalimentacion ?? null);

  const fechaCorreccion = new Date();

  // 9. Persistir en transacción atómica: cabecera + errores + notificación en BD
  const resultadoTransaccion = await correccionRepository.finalizarCorreccionTransaccion({
    entregaId,
    docenteId: docente.id,
    alumnoUsuarioId: entrega.alumno.usuario.id,
    ejercicioId: entrega.ejercicio.idEjercicio,
    tituloEjercicio: entrega.ejercicio.titulo,
    fechaCorreccion,
    retroalimentacion: retroalimentacionFinal,
    errores: erroresAPersistir,
  });

  // 10. Emitir evento en tiempo real vía Socket.IO al alumno
  try {
    emitirAUsuario(entrega.alumno.usuario.id, 'notificacion:nueva', {
      tipo: 'EJERCICIO_CORREGIDO',
      titulo: 'Ejercicio corregido',
      mensaje: `Tu entrega para "${entrega.ejercicio.titulo}" ha sido corregida.`,
      data: {
        idEjercicio: entrega.ejercicio.idEjercicio,
        idEntrega: entrega.idEntrega,
        titulo: entrega.ejercicio.titulo,
        fechaCorreccion: fechaCorreccion.toISOString(),
      },
      createdAt: fechaCorreccion,
    });
  } catch {
    // Si la emisión de socket falla, la corrección ya quedó persistida en BD correctamente
  }

  return {
    idCorreccion: resultadoTransaccion.correccion.idCorreccion,
    entregaId,
    fechaCorreccion: fechaCorreccion.toISOString(),
    retroalimentacion: retroalimentacionFinal,
    totalErrores: resultadoTransaccion.totalErroresPersistidos,
    mensaje: 'La corrección ha sido enviada y notificada al alumno exitosamente.',
  };
}

export async function guardarComentarioError(
  user: AuthUser,
  entregaId: number,
  body: GuardarComentarioErrorBodyDTO
) {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Buscar entrega y verificar pertenencia al docente
  const entrega = await correccionRepository.findEntregaParaRevisionPlantilla(entregaId);

  if (!entrega || entrega.ejercicio.docenteId !== docente.id) {
    throw new NotFoundError('Entrega no encontrada o no pertenece al docente.');
  }

  // 3. Validar que la entrega haya sido completada por el alumno
  if (!entrega.fechaEntrega) {
    throw new BadRequestError('La entrega aún no ha sido completada por el alumno.');
  }

  // 4. Validar que la corrección no haya sido finalizada previamente
  if (entrega.correccion?.fechaCorreccion) {
    throw new ConflictError(
      'La corrección de esta entrega ya ha sido finalizada y no puede modificarse.'
    );
  }

  // 5. Validar que la plantilla pertenezca al ejercicio de la entrega
  const plantillaExiste = entrega.ejercicio.plantillas.some(
    (p) => p.idEjercicioPlantilla === body.ejercicioPlantillaId
  );
  if (!plantillaExiste) {
    throw new NotFoundError('La plantilla especificada no pertenece al ejercicio de esta entrega.');
  }

  // 6. Persistir comentario del error
  const errorGuardado = await correccionRepository.upsertComentarioError(entregaId, docente.id, {
    idError: body.idError,
    ejercicioPlantillaId: body.ejercicioPlantillaId,
    tipoError: body.tipoError,
    detalle: body.detalle,
    comentario: body.comentario ?? null,
  });

  return {
    idError: errorGuardado.idError,
    ejercicioPlantillaId: errorGuardado.ejercicioPlantillaId,
    tipoError: errorGuardado.tipoError,
    comentarioDocente: errorGuardado.comentarioDocente,
    mensaje: errorGuardado.comentarioDocente
      ? 'Comentario del error guardado correctamente.'
      : 'Comentario del error eliminado correctamente.',
  };
}
