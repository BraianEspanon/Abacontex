import { AuthUser } from '../types/express';
import { ROLES } from '../constants/roles';

import { simulacionIaService } from '../integrations/simulacion-ia/simulacion-ia.service';
import { instanciarEstructuraParaEmpresa, puedeRolResponderEvento } from '../utils/simulacion.util';

import * as alumnoService from './alumno.service';

import * as simulacionRepository from '../repositories/simulacion.repository';
import * as cursoRepository from '../repositories/curso.repository';
import * as docenteRepository from '../repositories/docente.repository';
import * as transactionRepository from '../repositories/transaction.repository';

import {
  CrearSimulacionDTO,
  EditarTituloSimulacionBodyDTO,
  ObtenerEntregasSimulacionQueryDTO,
  ObtenerSimulacionesAlumnoQueryDTO,
  ObtenerSimulacionesDocenteQueryDTO,
  ResponderDecisionSimulacionBodyDTO,
} from '../validators/simulacion.validator';
import {
  EstadoParticipacionSimulacion,
  OPCIONES_DIFICULTADES_SIMULACION,
  OPCIONES_DURACIONES_SIMULACION,
  OPCIONES_FILTRO_ESTADO_ALUMNO_SIMULACION,
  OPCIONES_FLUJOS_EMPRESARIALES,
  OPCIONES_TIPOS_EVENTO_SORPRESA,
  PUNTOS_POR_CLASIFICACION,
  TipoEventoSimulacion,
} from '../constants/simulacion.constants';
import {
  ConversacionSimulacionResponseDTO,
  EditarTituloSimulacionResponseDTO,
  EntregasSimulacionResponseDTO,
  FiltrosDashboardAlumnoResponseDTO,
  ListarSimulacionesAlumnoResponseDTO,
  ListarSimulacionesDocenteResponseDTO,
  OpcionesCrearSimulacionResponseDTO,
  ResponderDecisionSimulacionResponseDTO,
  ResumenSimulacionResponseDTO,
  FeedbackFinalSimulacionDTO,
  SimulacionCreadaResponseDTO,
} from '../dto/simulacion/simulacion.dto';
import {
  toConversacionSimulacionResponse,
  toEntregasSimulacionResponse,
  toListarSimulacionesAlumnoResponse,
  toListarSimulacionesDocenteResponse,
  toResumenSimulacionResponse,
  toSimulacionCreadaResponse,
} from '../dto/simulacion/simulacion.mapper';

import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict.error';
import { ForbiddenError } from '../errors/forbidden.error';
import { NotFoundError } from '../errors/not-found.error';

export async function crearSimulacion(
  user: AuthUser,
  data: CrearSimulacionDTO
): Promise<SimulacionCreadaResponseDTO> {
  // 1. Obtener docente autenticado desde el repository
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Validar existencia del curso
  await cursoRepository.findByIdOrThrow(data.cursoId);

  // 3. Validar permisos del docente sobre el curso
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(data.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso especificado.');
  }

  // 4. Validar fecha límite
  const fechaLimite = new Date(data.fechaLimite);
  if (isNaN(fechaLimite.getTime()) || fechaLimite <= new Date()) {
    throw new BadRequestError('La fecha límite debe ser una fecha válida posterior a la actual.');
  }

  // 5. Consultar y validar empresas activas del curso con participantes
  const empresasCurso = await simulacionRepository.findEmpresasActivasConAlumnosYProductos(
    data.cursoId
  );
  const empresasValidas = empresasCurso.filter((e) => e.alumnos && e.alumnos.length > 0);

  if (empresasValidas.length === 0) {
    throw new BadRequestError(
      'El curso no tiene empresas con alumnos asignados para participar en la simulación.'
    );
  }

  // 6. Generar con IA la estructura base del flujo (1 sola llamada)
  const estructuraBase = await simulacionIaService.generarEstructuraParaCurso({
    flujo: data.flujoEmpresarial,
    dificultad: data.dificultad,
    duracion: data.duracion,
    eventosSorpresa: data.eventosSorpresa,
    usarDatosEmpresa: data.usarDatosEmpresa,
    ...(data.tipoEventoSorpresa ? { tipoEventoSorpresa: data.tipoEventoSorpresa } : {}),
  });

  // 7. Persistir simulación e instanciar grafos adaptados para cada empresa (1 transacción)
  const simulacionCreada = await transactionRepository.ejecutarTransaccion(async (tx) => {
    const nuevaSimulacion = await simulacionRepository.createSimulacion(
      {
        docenteId: docente.id,
        cursoId: data.cursoId,
        titulo: estructuraBase.titulo || `Simulación: ${data.flujoEmpresarial}`,
        flujoEmpresarial: data.flujoEmpresarial,
        dificultad: data.dificultad,
        duracion: data.duracion,
        eventosSorpresa: data.eventosSorpresa,
        usarDatosEmpresa: data.usarDatosEmpresa,
        fechaLimite,
      },
      tx
    );

    for (const empresa of empresasValidas) {
      const { estructuraAdaptada, variablesIniciales } = instanciarEstructuraParaEmpresa(
        estructuraBase,
        empresa,
        data.usarDatosEmpresa,
        data.dificultad
      );

      await simulacionRepository.createSimulacionEmpresaConGrafo(
        {
          simulacionId: nuevaSimulacion.idSimulacion,
          empresaId: empresa.id,
          estructura: estructuraAdaptada,
          variablesIniciales,
        },
        tx
      );
    }

    return nuevaSimulacion;
  });

  // 8. Mapear y retornar respuesta DTO desacoplada
  return toSimulacionCreadaResponse(simulacionCreada, empresasValidas.length);
}

export function obtenerOpcionesCrearSimulacion(): OpcionesCrearSimulacionResponseDTO {
  return {
    flujosEmpresariales: OPCIONES_FLUJOS_EMPRESARIALES,
    dificultades: OPCIONES_DIFICULTADES_SIMULACION,
    duraciones: OPCIONES_DURACIONES_SIMULACION,
    tiposEventoSorpresa: OPCIONES_TIPOS_EVENTO_SORPRESA,
  };
}

export function obtenerFiltrosDashboardAlumno(): FiltrosDashboardAlumnoResponseDTO {
  return {
    estados: [...OPCIONES_FILTRO_ESTADO_ALUMNO_SIMULACION],
  };
}

export async function listarSimulacionesDocente(
  user: AuthUser,
  query: ObtenerSimulacionesDocenteQueryDTO
): Promise<ListarSimulacionesDocenteResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Si se solicitó filtrar por curso, validar que el docente tenga acceso al mismo
  if (query.cursoId) {
    const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
    if (!cursosDocente.includes(query.cursoId)) {
      throw new ForbiddenError('No tienes permisos sobre el curso especificado.');
    }
  }

  // 3. Consultar simulaciones paginadas y métricas de resumen
  const resultado = await simulacionRepository.findSimulacionesDocentePaginadas(docente.id, query);

  // 4. Mapear y retornar respuesta
  const pageSize = query.pageSize ?? 6;
  return toListarSimulacionesDocenteResponse(
    resultado.items,
    resultado.totalItems,
    query.page ?? 1,
    pageSize,
    resultado.resumen
  );
}

export async function editarTituloSimulacion(
  user: AuthUser,
  idSimulacion: number,
  data: EditarTituloSimulacionBodyDTO
): Promise<EditarTituloSimulacionResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Buscar simulación validando autoría (lanza NotFoundError si no existe o no le pertenece)
  const simulacion = await simulacionRepository.findByIdAndDocenteOrThrow(idSimulacion, docente.id);

  // 3. Validar pertenencia al curso
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(simulacion.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso al que pertenece esta simulación.');
  }

  // 4. Actualizar título en base de datos
  const simulacionActualizada = await simulacionRepository.updateTitulo(idSimulacion, data.titulo);

  return {
    idSimulacion: simulacionActualizada.idSimulacion,
    titulo: simulacionActualizada.titulo,
    updatedAt: simulacionActualizada.updatedAt.toISOString(),
  };
}

export async function obtenerEntregasSimulacion(
  user: AuthUser,
  idSimulacion: number,
  query: ObtenerEntregasSimulacionQueryDTO
): Promise<EntregasSimulacionResponseDTO> {
  // 1. Obtener docente autenticado
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Consultar entregas y cabecera validando autoría (lanza NotFoundError si no existe o no le pertenece)
  const resultado = await simulacionRepository.findEntregasSimulacion(
    idSimulacion,
    docente.id,
    query
  );

  // 3. Validar permisos activos sobre el curso
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(resultado.cabecera.curso.idCurso)) {
    throw new ForbiddenError('No tienes permisos sobre el curso al que pertenece esta simulación.');
  }

  // 4. Mapear y retornar respuesta paginada con cabecera
  return toEntregasSimulacionResponse(
    resultado.cabecera,
    resultado.items,
    resultado.totalItems,
    resultado.page,
    resultado.pageSize
  );
}

export async function listarSimulacionesAlumno(
  user: AuthUser,
  query: ObtenerSimulacionesAlumnoQueryDTO
): Promise<ListarSimulacionesAlumnoResponseDTO> {
  // 1. Obtener alumno autenticado con su empresa y rol
  const usuario = await alumnoService.getAlumnoSimulacionOrThrow(user);

  const empresaId = usuario.alumno.empresa.id;
  const rolAlumno = usuario.alumno.rolEmpresa.nombreRol;

  // 2. Consultar simulaciones paginadas y métricas globales para la empresa
  const resultado = await simulacionRepository.findSimulacionesAlumnoPaginadas(
    empresaId,
    rolAlumno,
    query
  );

  // 3. Mapear y retornar respuesta
  const pageSize = query.pageSize ?? 6;
  return toListarSimulacionesAlumnoResponse(
    resultado.items,
    resultado.totalItems,
    query.page ?? 1,
    pageSize,
    resultado.resumen,
    rolAlumno
  );
}

export async function obtenerConversacionSimulacion(
  user: AuthUser,
  idSimulacionEmpresa: number
): Promise<ConversacionSimulacionResponseDTO> {
  // 1. Obtener la simulación de la empresa
  const simulacionEmpresa =
    await simulacionRepository.findConversacionSimulacionEmpresa(idSimulacionEmpresa);

  if (!simulacionEmpresa) {
    throw new NotFoundError('La simulación empresarial no fue encontrada.');
  }

  const esDocente = user.roles.includes(ROLES.DOCENTE);
  let rolAlumno: string | null = null;

  if (esDocente) {
    // Validar que el docente tenga acceso al curso de la simulación
    const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);
    const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);

    const tienePermiso =
      simulacionEmpresa.simulacion.docenteId === docente.id ||
      cursosDocente.includes(simulacionEmpresa.simulacion.cursoId);

    if (!tienePermiso) {
      throw new NotFoundError('La simulación empresarial no fue encontrada.');
    }
  } else {
    // Validar que el alumno pertenezca a la empresa asignada
    const usuario = await alumnoService.getAlumnoSimulacionOrThrow(user);

    if (usuario.alumno.empresa.id !== simulacionEmpresa.empresaId) {
      throw new NotFoundError('La simulación empresarial no fue encontrada.');
    }

    rolAlumno = usuario.alumno.rolEmpresa.nombreRol;
  }

  return toConversacionSimulacionResponse(simulacionEmpresa, {
    esDocente,
    rolAlumno,
  });
}

export async function responderDecisionSimulacion(
  user: AuthUser,
  idSimulacionEmpresa: number,
  body: ResponderDecisionSimulacionBodyDTO
): Promise<ResponderDecisionSimulacionResponseDTO> {
  // 1. Obtener alumno autenticado con su empresa y rol
  const usuario = await alumnoService.getAlumnoSimulacionOrThrow(user);
  const alumno = usuario.alumno;

  // 2. Obtener estado actual de la simulación para responder
  const simEmpresa =
    await simulacionRepository.findSimulacionEmpresaParaResponder(idSimulacionEmpresa);

  // Prevención de enumeración de IDs: NotFoundError si no existe o es de otra empresa
  if (!simEmpresa || simEmpresa.empresaId !== alumno.empresa.id) {
    throw new NotFoundError('La simulación empresarial no fue encontrada.');
  }

  // 3. Validar estado general y fecha límite
  if (simEmpresa.estado === EstadoParticipacionSimulacion.FINALIZADA) {
    throw new ConflictError('La simulación empresarial ya ha finalizado.');
  }

  if (new Date() > simEmpresa.simulacion.fechaLimite) {
    throw new ConflictError('El plazo para responder la simulación ha vencido.');
  }

  // 4. Validar que exista una decisión activa pendiente
  const eventoActivo = simEmpresa.eventoActual;
  if (!eventoActivo || eventoActivo.tipo !== TipoEventoSimulacion.DECISION) {
    throw new ConflictError('El evento actual no requiere una decisión.');
  }

  const yaRespondida = simEmpresa.decisiones.some((d) => d.eventoId === eventoActivo.idEvento);
  if (yaRespondida) {
    throw new ConflictError('Esta decisión ya ha sido respondida por otro integrante del equipo.');
  }

  // 5. Validar que el rol del alumno esté habilitado para responder
  const puedeResponder = puedeRolResponderEvento(
    eventoActivo.rolesHabilitados,
    alumno.rolEmpresa.nombreRol
  );
  if (!puedeResponder) {
    throw new ForbiddenError('Tu rol no está habilitado para tomar esta decisión.');
  }

  // 6. Validar que la opción elegida pertenezca al evento
  const opcion = eventoActivo.opciones.find((op) => op.idOpcion === body.idOpcion);
  if (!opcion) {
    throw new BadRequestError('La opción seleccionada no es válida para el evento actual.');
  }

  // 7. Calcular puntos de la opción elegida
  const puntosObtenidos = PUNTOS_POR_CLASIFICACION[opcion.clasificacion] ?? 0;

  // 8. Determinar siguiente paso y si finaliza la simulación
  let finalizada = false;
  let nuevoEventoActualId: number | null = null;

  if (opcion.siguienteEventoId) {
    const siguienteEvento = await simulacionRepository.findEventoById(opcion.siguienteEventoId);
    if (!siguienteEvento || siguienteEvento.tipo === TipoEventoSimulacion.FINAL) {
      finalizada = true;
      nuevoEventoActualId = siguienteEvento?.idEvento ?? null;
    } else {
      nuevoEventoActualId = siguienteEvento.idEvento;
    }
  } else {
    finalizada = true;
  }

  // 9. Calcular puntaje final si finaliza (escala 0 a 100)
  let puntajeFinal: number | undefined;
  if (finalizada) {
    const totalDecisiones = simEmpresa.decisiones.length + 1;
    const totalPuntosObtenidos =
      simEmpresa.decisiones.reduce((acc, d) => acc + d.puntosObtenidos, 0) + puntosObtenidos;
    const maxPuntosPosibles = totalDecisiones * 3;
    puntajeFinal = Math.min(
      100,
      Math.max(0, Math.round((totalPuntosObtenidos / maxPuntosPosibles) * 100))
    );
  }

  // 10. Actualizar variables de estado simuladas si la opción incluye cambios
  const variablesActuales = (simEmpresa.estadoInterno?.variables as Record<string, unknown>) ?? {};
  const nuevasVariables: Record<string, unknown> = { ...variablesActuales };

  if (opcion.cambiosSimulados && typeof opcion.cambiosSimulados === 'object') {
    Object.assign(nuevasVariables, opcion.cambiosSimulados);
  }

  const historialActual = Array.isArray(simEmpresa.estadoInterno?.historialEventos)
    ? (simEmpresa.estadoInterno.historialEventos as unknown[])
    : [];

  const nuevoHistorial: unknown[] = [
    ...historialActual,
    {
      idEvento: eventoActivo.idEvento,
      idOpcion: opcion.idOpcion,
      alumnoId: alumno.id,
      rol: alumno.rolEmpresa.nombreRol,
      fecha: new Date().toISOString(),
    },
  ];

  // 11. Ejecutar persistencia atómica en transacción
  await transactionRepository.ejecutarTransaccion(async (tx) => {
    // a) Crear decisión inmutable
    await simulacionRepository.createDecisionSimulacion(
      {
        simulacionEmpresaId: idSimulacionEmpresa,
        eventoId: eventoActivo.idEvento,
        opcionId: opcion.idOpcion,
        alumnoId: alumno.id,
        rolEmpresaId: alumno.idRolEmpresa!,
        puntosObtenidos,
      },
      tx
    );

    // b) Actualizar variables e historial interno
    await simulacionRepository.updateEstadoSimulacionEmpresaVariables(
      idSimulacionEmpresa,
      nuevasVariables,
      nuevoHistorial,
      tx
    );

    // c) Actualizar progreso de la simulación
    await simulacionRepository.actualizarProgresoSimulacionEmpresa(
      idSimulacionEmpresa,
      {
        estado: finalizada
          ? EstadoParticipacionSimulacion.FINALIZADA
          : EstadoParticipacionSimulacion.EN_CURSO,
        eventoActualId: nuevoEventoActualId,
        fechaInicio: simEmpresa.fechaInicio ?? new Date(),
        ...(finalizada ? { fechaFinalizacion: new Date(), puntajeFinal } : {}),
      },
      tx
    );
  });

  // 12. Si finalizó, intentar generar y persistir el feedback final con IA
  if (finalizada) {
    try {
      const resumenEntity =
        await simulacionRepository.findResumenSimulacionEmpresa(idSimulacionEmpresa);
      if (resumenEntity && !resumenEntity.feedbackFinal) {
        await resolverFeedbackFinal(resumenEntity);
      }
    } catch (err) {
      console.warn('No se pudo generar el feedback de IA al finalizar la simulación:', err);
    }
  }

  // 13. Retornar confirmación de la decisión
  return {
    mensaje: 'Decisión registrada exitosamente.',
    finalizada,
  };
}

const promesasFeedbackEnVuelo = new Map<number, Promise<FeedbackFinalSimulacionDTO>>();

async function resolverFeedbackFinal(
  simEmpresa: simulacionRepository.ResumenSimulacionEmpresaEntity
): Promise<FeedbackFinalSimulacionDTO> {
  if (simEmpresa.feedbackFinal) {
    return simEmpresa.feedbackFinal as unknown as FeedbackFinalSimulacionDTO;
  }

  const id = simEmpresa.idSimulacionEmpresa;
  if (promesasFeedbackEnVuelo.has(id)) {
    return promesasFeedbackEnVuelo.get(id)!;
  }

  const promesa = (async () => {
    try {
      const decisionesFormateadas = simEmpresa.decisiones.map((d, index) => ({
        orden: index + 1,
        eventoTitulo: d.evento.codigoEvento,
        opcionElegida: d.opcion.texto,
        clasificacion: d.opcion.clasificacion,
        puntos: d.puntosObtenidos,
        rol: d.rolEmpresa.nombreRol,
        alumnoNombre: `${d.alumno.usuario.nombre} ${d.alumno.usuario.apellido}`.trim(),
      }));

      const variablesFinales =
        (simEmpresa.estadoInterno?.variables as Record<string, unknown>) ?? {};

      const feedback = await simulacionIaService.generarFeedbackFinal({
        tituloSimulacion: simEmpresa.simulacion.titulo,
        flujo: simEmpresa.simulacion.flujoEmpresarial,
        empresaNombre: simEmpresa.empresa.nombre,
        puntajeFinal: simEmpresa.puntajeFinal ?? 0,
        decisiones: decisionesFormateadas,
        variablesFinales,
      });

      await simulacionRepository.updateFeedbackFinalSimulacionEmpresa(id, feedback);
      return feedback;
    } finally {
      promesasFeedbackEnVuelo.delete(id);
    }
  })();

  promesasFeedbackEnVuelo.set(id, promesa);
  return promesa;
}

export async function obtenerResumenSimulacion(
  user: AuthUser,
  idSimulacionEmpresa: number
): Promise<ResumenSimulacionResponseDTO> {
  // 1. Obtener datos de la simulación empresarial
  const simEmpresa = await simulacionRepository.findResumenSimulacionEmpresa(idSimulacionEmpresa);

  if (!simEmpresa) {
    throw new NotFoundError('La simulación empresarial no fue encontrada.');
  }

  // 2. Validar pertenencia y permisos según rol (mitigación de enumeración de IDs)
  const esDocente = user.roles.includes(ROLES.DOCENTE);

  if (esDocente) {
    const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);
    const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);

    const tienePermiso =
      simEmpresa.simulacion.docenteId === docente.id ||
      cursosDocente.includes(simEmpresa.simulacion.cursoId);

    if (!tienePermiso) {
      throw new NotFoundError('La simulación empresarial no fue encontrada.');
    }
  } else {
    const usuario = await alumnoService.getAlumnoSimulacionOrThrow(user);

    if (usuario.alumno.empresa.id !== simEmpresa.empresaId) {
      throw new NotFoundError('La simulación empresarial no fue encontrada.');
    }
  }

  // 3. Validar estado: sólo disponible cuando está FINALIZADA
  if (simEmpresa.estado !== EstadoParticipacionSimulacion.FINALIZADA) {
    throw new ConflictError('La simulación aún no ha finalizado.');
  }

  // 4. Resolver feedback final (utiliza el guardado o genera y persiste si faltaba)
  const feedbackFinal = await resolverFeedbackFinal(simEmpresa);

  // 5. Mapear y retornar respuesta
  return toResumenSimulacionResponse(simEmpresa, feedbackFinal);
}
