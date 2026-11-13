import {
  ConversacionSimulacionEmpresaEntity,
  ResumenSimulacionEmpresaEntity,
  SimulacionAlumnoListItemEntity,
  SimulacionCreadaEntity,
} from '../../repositories/simulacion.repository';
import { EstadoParticipacionSimulacion } from '../../constants/simulacion.constants';
import {
  adaptarTituloSimulacion,
  calcularLongitudCaminoGrafo,
  calcularProgresoSimulacion,
  puedeRolResponderEvento,
  resolverUltimaActividadSimulacion,
} from '../../utils/simulacion.util';
import {
  CabeceraEntregasSimulacionDTO,
  ConversacionSimulacionResponseDTO,
  DecisionActivaDTO,
  EntregaSimulacionEmpresaItemDTO,
  EntregasSimulacionResponseDTO,
  IntegranteEmpresaDTO,
  ListarSimulacionesAlumnoResponseDTO,
  ListarSimulacionesDocenteResponseDTO,
  MensajeConversacionDTO,
  ModoConversacionSimulacion,
  ResumenDashboardAlumnoDTO,
  ResumenDashboardDocenteDTO,
  ResumenSimulacionResponseDTO,
  FeedbackFinalSimulacionDTO,
  SimulacionAlumnoCardDTO,
  SimulacionCreadaResponseDTO,
  SimulacionDocenteCardDTO,
} from './simulacion.dto';

export function toSimulacionCreadaResponse(
  simulacion: SimulacionCreadaEntity,
  empresasParticipantes: number
): SimulacionCreadaResponseDTO {
  return {
    idSimulacion: simulacion.idSimulacion,
    titulo: simulacion.titulo,
    flujoEmpresarial: simulacion.flujoEmpresarial,
    dificultad: simulacion.dificultad,
    duracion: simulacion.duracion,
    eventosSorpresa: simulacion.eventosSorpresa,
    usarDatosEmpresa: simulacion.usarDatosEmpresa,
    fechaLimite: simulacion.fechaLimite.toISOString(),
    estado: simulacion.estado,
    curso: {
      idCurso: simulacion.curso.idCurso,
      nombreCurso: simulacion.curso.nombreCurso,
      año: simulacion.curso.año,
    },
    empresasParticipantes,
    createdAt: simulacion.createdAt.toISOString(),
    updatedAt: simulacion.updatedAt.toISOString(),
  };
}

export interface SimulacionDocenteListItemEntity {
  idSimulacion: number;
  titulo: string;
  fechaLimite: Date;
  createdAt: Date;
  updatedAt: Date;
  curso: {
    idCurso: number;
    nombreCurso: string;
  };
  empresas: {
    idSimulacionEmpresa: number;
    estado: string;
    puntajeFinal: number | null;
  }[];
}

export function toSimulacionDocenteCard(
  simulacion: SimulacionDocenteListItemEntity
): SimulacionDocenteCardDTO {
  const empresasTotales = simulacion.empresas.length;
  const empresasQueHanEmpezado = simulacion.empresas.filter(
    (e) => e.estado === 'EN_CURSO' || e.estado === 'FINALIZADA'
  ).length;
  const finalizadas = simulacion.empresas.filter((e) => e.estado === 'FINALIZADA');
  const empresasFinalizadas = finalizadas.length;

  let puntajePromedio: number | null = null;
  if (empresasFinalizadas > 0) {
    const totalPuntos = finalizadas.reduce((acc, e) => acc + (e.puntajeFinal ?? 0), 0);
    puntajePromedio = Math.round(totalPuntos / empresasFinalizadas);
  }

  let estado: EstadoParticipacionSimulacion = EstadoParticipacionSimulacion.PENDIENTE;
  if (empresasTotales > 0 && empresasFinalizadas === empresasTotales) {
    estado = EstadoParticipacionSimulacion.FINALIZADA;
  } else if (empresasQueHanEmpezado > 0) {
    estado = EstadoParticipacionSimulacion.EN_CURSO;
  }

  return {
    idSimulacion: simulacion.idSimulacion,
    titulo: simulacion.titulo,
    estado,
    fechaLimite: simulacion.fechaLimite.toISOString(),
    curso: {
      idCurso: simulacion.curso.idCurso,
      nombreCurso: simulacion.curso.nombreCurso,
    },
    empresasQueHanEmpezado,
    empresasTotales,
    puntajePromedio,
    createdAt: simulacion.createdAt.toISOString(),
    updatedAt: simulacion.updatedAt.toISOString(),
  };
}

export function toListarSimulacionesDocenteResponse(
  items: SimulacionDocenteListItemEntity[],
  totalItems: number,
  page: number,
  pageSize: number,
  resumen: ResumenDashboardDocenteDTO
): ListarSimulacionesDocenteResponseDTO {
  return {
    items: items.map(toSimulacionDocenteCard),
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize) || 1,
    resumen,
  };
}

export interface SimulacionEmpresaEntregaEntity {
  idSimulacionEmpresa: number;
  empresaId: number;
  estado: string;
  puntajeFinal: number | null;
  fechaInicio: Date | null;
  fechaFinalizacion: Date | null;
  empresa: {
    id: number;
    nombre: string;
    logoUrl: string | null;
    alumnos: {
      id: string;
      rolEmpresa: {
        idRol: number;
        nombreRol: string;
      } | null;
    }[];
  };
  _count: {
    eventos: number;
    decisiones: number;
  };
  decisiones: {
    fechaDecision: Date;
    rolEmpresa: {
      nombreRol: string;
    };
  }[];
}

export function toEntregaSimulacionEmpresaItem(
  entity: SimulacionEmpresaEntregaEntity
): EntregaSimulacionEmpresaItemDTO {
  const eventosTotales =
    entity.estado === 'FINALIZADA' ? entity._count.decisiones + 1 : entity._count.eventos;

  const { eventosCompletados, porcentajeProgreso } = calcularProgresoSimulacion(
    entity.estado,
    eventosTotales,
    entity._count.decisiones
  );

  const rolesInvolucrados = Array.from(
    new Set(
      entity.empresa.alumnos
        .map((a) => a.rolEmpresa?.nombreRol)
        .filter((r): r is string => Boolean(r))
    )
  );

  const ultimaActividad = resolverUltimaActividadSimulacion(
    entity.decisiones,
    entity.fechaFinalizacion,
    entity.fechaInicio
  );

  return {
    idSimulacionEmpresa: entity.idSimulacionEmpresa,
    empresaId: entity.empresa.id,
    nombreEmpresa: entity.empresa.nombre,
    logoUrl: entity.empresa.logoUrl,
    cantidadIntegrantes: entity.empresa.alumnos.length,
    rolesInvolucrados,
    estado: entity.estado,
    eventosCompletados,
    eventosTotales,
    porcentajeProgreso,
    puntajeFinal: entity.puntajeFinal,
    ultimaActividad,
    fechaFinalizacion: entity.fechaFinalizacion?.toISOString() ?? null,
  };
}

export function toEntregasSimulacionResponse(
  simulacion: CabeceraEntregasSimulacionDTO,
  items: SimulacionEmpresaEntregaEntity[],
  totalItems: number,
  page: number,
  pageSize: number
): EntregasSimulacionResponseDTO {
  return {
    simulacion,
    items: items.map(toEntregaSimulacionEmpresaItem),
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize) || 1,
  };
}

export function toSimulacionAlumnoCard(
  entity: SimulacionAlumnoListItemEntity,
  rolAlumno: string | null
): SimulacionAlumnoCardDTO {
  const variables = (entity.estadoInterno?.variables as Record<string, unknown>) ?? {};
  const cantEventosTotales =
    typeof variables.cantEventosTotales === 'number'
      ? variables.cantEventosTotales
      : entity.estado === 'FINALIZADA'
        ? entity._count.decisiones + 1
        : entity._count.eventos;

  const { eventoActualNumero, porcentajeProgreso } = calcularProgresoSimulacion(
    entity.estado,
    cantEventosTotales,
    entity._count.decisiones
  );

  const requiereMiDecision =
    entity.estado === 'EN_CURSO' &&
    entity.eventoActual?.tipo === 'DECISION' &&
    puedeRolResponderEvento(entity.eventoActual.rolesHabilitados, rolAlumno);

  const titulo = adaptarTituloSimulacion(
    entity.simulacion.titulo,
    entity.empresa?.nombre,
    entity.estadoInterno?.variables,
    entity.simulacion.usarDatosEmpresa
  );

  const ultimaActividad = resolverUltimaActividadSimulacion(
    entity.decisiones,
    entity.fechaFinalizacion,
    entity.fechaInicio
  );

  return {
    idSimulacionEmpresa: entity.idSimulacionEmpresa,
    titulo,
    estado: entity.estado,
    requiereMiDecision,
    eventoActualNumero,
    cantEventosTotales,
    porcentajeProgreso,
    fechaLimite: entity.simulacion.fechaLimite.toISOString(),
    ultimaActividad,
  };
}

export function toListarSimulacionesAlumnoResponse(
  items: SimulacionAlumnoListItemEntity[],
  totalItems: number,
  page: number,
  pageSize: number,
  resumen: ResumenDashboardAlumnoDTO,
  rolAlumno: string | null
): ListarSimulacionesAlumnoResponseDTO {
  return {
    items: items.map((item) => toSimulacionAlumnoCard(item, rolAlumno)),
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize) || 1,
    resumen,
  };
}

export interface ToConversacionSimulacionOptions {
  esDocente: boolean;
  rolAlumno?: string | null;
}

export function toConversacionSimulacionResponse(
  entity: ConversacionSimulacionEmpresaEntity,
  options: ToConversacionSimulacionOptions
): ConversacionSimulacionResponseDTO {
  const modo: ModoConversacionSimulacion =
    options.esDocente || entity.estado === 'FINALIZADA' ? 'LECTURA' : 'INTERACTIVO';

  const titulo = adaptarTituloSimulacion(
    entity.simulacion.titulo,
    entity.empresa.nombre,
    entity.estadoInterno?.variables,
    entity.simulacion.usarDatosEmpresa
  );

  const variables = (entity.estadoInterno?.variables as Record<string, unknown>) ?? {};
  const cantEventosTotales =
    typeof variables.cantEventosTotales === 'number'
      ? (variables.cantEventosTotales as number)
      : calcularLongitudCaminoGrafo(entity.eventos, entity.eventoInicialId);

  const { eventoActualNumero, porcentajeProgreso } = calcularProgresoSimulacion(
    entity.estado,
    cantEventosTotales,
    entity._count.decisiones
  );

  const integrantes: IntegranteEmpresaDTO[] = entity.empresa.alumnos.map((a) => ({
    idAlumno: a.id,
    nombre: a.usuario.nombre,
    apellido: a.usuario.apellido,
    rol: a.rolEmpresa?.nombreRol ?? 'Sin rol',
    fotoPerfilUrl: a.usuario.fotoPerfilUrl,
  }));

  const mensajes: MensajeConversacionDTO[] = [];
  const fechaBaseIso = (entity.fechaInicio ?? new Date()).toISOString();

  // 1. Mensaje de bienvenida / contexto inicial si existe
  if (entity.situacionInicial?.trim()) {
    mensajes.push({
      id: 'msg-situacion-inicial',
      tipoMensaje: 'SITUACION_INICIAL',
      emisor: 'ABA',
      mensaje: entity.situacionInicial.trim(),
      fecha: fechaBaseIso,
    });
  }

  // 2. Mapas para búsqueda rápida de eventos y decisiones
  const eventosMap = new Map(entity.eventos.map((ev) => [ev.idEvento, ev]));
  const decisionesMap = new Map(entity.decisiones.map((dec) => [dec.eventoId, dec]));

  // 3. Recorrer el grafo histórico desde el evento inicial
  const visitados = new Set<number>();
  let currentEventoId: number | null =
    entity.eventoInicialId ?? entity.eventos[0]?.idEvento ?? null;

  while (currentEventoId && !visitados.has(currentEventoId)) {
    visitados.add(currentEventoId);
    const evento = eventosMap.get(currentEventoId);
    if (!evento) break;

    mensajes.push({
      id: `ev-${evento.idEvento}`,
      tipoMensaje: 'EVENTO',
      tipoEvento: evento.tipo,
      emisor: evento.emisor,
      mensaje: evento.mensaje,
      ...(evento.esSorpresa ? { esSorpresa: true } : {}),
      rolesHabilitados: (evento.rolesHabilitados as string[]) ?? [],
      fecha: fechaBaseIso,
    });

    if (evento.tipo === 'DECISION') {
      const decision = decisionesMap.get(evento.idEvento);
      if (decision) {
        mensajes.push({
          id: `dec-${decision.idDecision}`,
          tipoMensaje: 'DECISION_TOMADA',
          emisor: decision.rolEmpresa?.nombreRol ?? 'Equipo',
          mensaje: decision.opcion.texto,
          fecha: decision.fechaDecision.toISOString(),
          decision: {
            idDecision: decision.idDecision,
            alumno: {
              id: decision.alumno.id,
              nombre: decision.alumno.usuario.nombre,
              apellido: decision.alumno.usuario.apellido,
              rol: decision.rolEmpresa?.nombreRol ?? 'Sin rol',
              fotoPerfilUrl: decision.alumno.usuario.fotoPerfilUrl,
            },
            opcionElegida: {
              idOpcion: decision.opcion.idOpcion,
              codigoOpcion: decision.opcion.codigoOpcion,
              texto: decision.opcion.texto,
              ...(options.esDocente || entity.estado === 'FINALIZADA'
                ? { clasificacion: decision.opcion.clasificacion }
                : {}),
              ...(decision.opcion.cambiosSimulados
                ? { cambiosSimulados: decision.opcion.cambiosSimulados as Record<string, unknown> }
                : {}),
            },
            ...(options.esDocente || entity.estado === 'FINALIZADA'
              ? { puntosObtenidos: decision.puntosObtenidos }
              : {}),
            fechaDecision: decision.fechaDecision.toISOString(),
          },
        });

        currentEventoId = decision.opcion.siguienteEventoId ?? null;
      } else {
        // Decisión activa aún pendiente de respuesta
        break;
      }
    } else if (evento.tipo === 'INFORMATIVO') {
      currentEventoId = evento.siguienteEventoId ?? null;
    } else if (evento.tipo === 'FINAL') {
      break;
    } else {
      break;
    }
  }

  // Fallback de contingencia si no se pudo recorrer por grafo
  if (visitados.size === 0 && entity.decisiones.length > 0) {
    for (const dec of entity.decisiones) {
      mensajes.push({
        id: `ev-${dec.evento.idEvento}`,
        tipoMensaje: 'EVENTO',
        tipoEvento: dec.evento.tipo,
        emisor: dec.evento.emisor,
        mensaje: dec.evento.mensaje,
        ...(dec.evento.esSorpresa ? { esSorpresa: true } : {}),
        rolesHabilitados: (dec.evento.rolesHabilitados as string[]) ?? [],
        fecha: dec.fechaDecision.toISOString(),
      });

      mensajes.push({
        id: `dec-${dec.idDecision}`,
        tipoMensaje: 'DECISION_TOMADA',
        emisor: dec.rolEmpresa?.nombreRol ?? 'Equipo',
        mensaje: dec.opcion.texto,
        fecha: dec.fechaDecision.toISOString(),
        decision: {
          idDecision: dec.idDecision,
          alumno: {
            id: dec.alumno.id,
            nombre: dec.alumno.usuario.nombre,
            apellido: dec.alumno.usuario.apellido,
            rol: dec.rolEmpresa?.nombreRol ?? 'Sin rol',
            fotoPerfilUrl: dec.alumno.usuario.fotoPerfilUrl,
          },
          opcionElegida: {
            idOpcion: dec.opcion.idOpcion,
            codigoOpcion: dec.opcion.codigoOpcion,
            texto: dec.opcion.texto,
            ...(options.esDocente || entity.estado === 'FINALIZADA'
              ? { clasificacion: dec.opcion.clasificacion }
              : {}),
            ...(dec.opcion.cambiosSimulados
              ? { cambiosSimulados: dec.opcion.cambiosSimulados as Record<string, unknown> }
              : {}),
          },
          ...(options.esDocente || entity.estado === 'FINALIZADA'
            ? { puntosObtenidos: dec.puntosObtenidos }
            : {}),
          fechaDecision: dec.fechaDecision.toISOString(),
        },
      });
    }

    if (entity.eventoActual && !decisionesMap.has(entity.eventoActual.idEvento)) {
      mensajes.push({
        id: `ev-${entity.eventoActual.idEvento}`,
        tipoMensaje: 'EVENTO',
        tipoEvento: entity.eventoActual.tipo,
        emisor: entity.eventoActual.emisor,
        mensaje: entity.eventoActual.mensaje,
        ...(entity.eventoActual.esSorpresa ? { esSorpresa: true } : {}),
        rolesHabilitados: (entity.eventoActual.rolesHabilitados as string[]) ?? [],
        fecha: fechaBaseIso,
      });
    }
  }

  // 4. Determinar si hay decisión activa
  let decisionActiva: DecisionActivaDTO | null = null;
  const eventoActivo = entity.eventoActual;

  if (
    entity.estado !== 'FINALIZADA' &&
    eventoActivo &&
    eventoActivo.tipo === 'DECISION' &&
    !decisionesMap.has(eventoActivo.idEvento)
  ) {
    let puedeDecidir = false;

    if (modo === 'INTERACTIVO') {
      const fechaLimiteVencida = new Date() > entity.simulacion.fechaLimite;
      if (!fechaLimiteVencida) {
        puedeDecidir = puedeRolResponderEvento(
          eventoActivo.rolesHabilitados,
          options.rolAlumno ?? null
        );
      }
    }

    const roles = (eventoActivo.rolesHabilitados as string[]) ?? [];
    let rolRequeridoTexto = 'Cualquier integrante';
    if (roles.length === 1 && roles[0] !== 'TODOS') {
      rolRequeridoTexto = roles[0] ?? 'Cualquier integrante';
    } else if (roles.length > 1 && !roles.includes('TODOS')) {
      rolRequeridoTexto = `${roles.slice(0, -1).join(', ')} o ${roles[roles.length - 1]}`;
    }

    decisionActiva = {
      idEvento: eventoActivo.idEvento,
      puedeDecidir,
      rolRequeridoTexto,
      rolesHabilitados: roles,
      opciones: (eventoActivo.opciones ?? []).map((op) => ({
        idOpcion: op.idOpcion,
        texto: op.texto,
        ...(options.esDocente ? { clasificacion: op.clasificacion } : {}),
      })),
    };
  }

  return {
    idSimulacionEmpresa: entity.idSimulacionEmpresa,
    titulo,
    estado: entity.estado,
    modo,
    progreso: {
      eventoActualNumero,
      cantEventosTotales,
      porcentajeProgreso,
    },
    integrantes,
    mensajes,
    decisionActiva,
  };
}

export function toResumenSimulacionResponse(
  entity: ResumenSimulacionEmpresaEntity,
  feedbackFinalOverride?: FeedbackFinalSimulacionDTO
): ResumenSimulacionResponseDTO {
  const titulo = entity.simulacion.titulo
    ? adaptarTituloSimulacion(entity.simulacion.titulo, entity.empresa.nombre)
    : `Simulación: ${entity.simulacion.flujoEmpresarial}`;

  const rolesSet = new Set<string>();
  for (const decision of entity.decisiones) {
    if (decision.rolEmpresa?.nombreRol) {
      rolesSet.add(decision.rolEmpresa.nombreRol);
    }
  }

  const rawFeedback = (feedbackFinalOverride ?? entity.feedbackFinal) as Record<
    string,
    unknown
  > | null;
  const feedbackFinal: FeedbackFinalSimulacionDTO = {
    resumenGeneral:
      typeof rawFeedback?.resumenGeneral === 'string' ? rawFeedback.resumenGeneral : '',
    fortalezas: Array.isArray(rawFeedback?.fortalezas) ? rawFeedback.fortalezas.map(String) : [],
    aspectosAMejorar: Array.isArray(rawFeedback?.aspectosAMejorar)
      ? rawFeedback.aspectosAMejorar.map(String)
      : [],
    conclusion: typeof rawFeedback?.conclusion === 'string' ? rawFeedback.conclusion : '',
  };

  const variables = (entity.estadoInterno?.variables as Record<string, unknown>) ?? {};
  const cantEventosTotales =
    typeof variables.cantEventosTotales === 'number'
      ? (variables.cantEventosTotales as number)
      : entity.estado === 'FINALIZADA'
        ? entity.decisiones.length + 1
        : entity._count.eventos;

  const eventosCompletados =
    entity.estado === 'FINALIZADA' ? cantEventosTotales : entity.decisiones.length;

  return {
    idSimulacionEmpresa: entity.idSimulacionEmpresa,
    titulo,
    estado: entity.estado,
    empresa: {
      id: entity.empresa.id,
      nombre: entity.empresa.nombre,
    },
    puntajeFinal: entity.puntajeFinal ?? 0,
    eventosCompletados,
    cantEventosTotales,
    fechaLimite: entity.simulacion.fechaLimite.toISOString(),
    fechaFinalizacion: entity.fechaFinalizacion?.toISOString() ?? null,
    flujoEmpresarial: entity.simulacion.flujoEmpresarial,
    rolesIntervinieron: Array.from(rolesSet),
    feedbackFinal,
  };
}
