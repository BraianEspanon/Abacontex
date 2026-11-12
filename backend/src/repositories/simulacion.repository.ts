import {
  ClasificacionOpcionSimulacion,
  DificultadSimulacion,
  DuracionSimulacion,
  EstadoParticipacionSimulacion,
  EstadoSimulacion,
  Prisma,
  TipoEventoSimulacion,
} from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { ESTADOS_PRODUCCION } from '../constants/estados-produccion';
import { NotFoundError } from '../errors/not-found.error';
import type { EstructuraSimulacionGeneradaIA } from '../integrations/simulacion-ia/simulacion-ia.types';
import type {
  ObtenerEntregasSimulacionQueryDTO,
  ObtenerSimulacionesAlumnoQueryDTO,
  ObtenerSimulacionesDocenteQueryDTO,
} from '../validators/simulacion.validator';

export interface CreateSimulacionInput {
  docenteId: string;
  cursoId: number;
  titulo: string;
  flujoEmpresarial: string;
  dificultad: DificultadSimulacion;
  duracion: DuracionSimulacion;
  eventosSorpresa: boolean;
  usarDatosEmpresa: boolean;
  fechaLimite: Date;
  estado?: EstadoSimulacion;
}

export interface CreateSimulacionEmpresaInput {
  simulacionId: number;
  empresaId: number;
  estado?: EstadoParticipacionSimulacion;
  situacionInicial: string;
}

export interface CreateEventoSimulacionInput {
  simulacionEmpresaId: number;
  codigoEvento: string;
  tipo: TipoEventoSimulacion;
  emisor: string;
  mensaje: string;
  esSorpresa: boolean;
  rolesHabilitados?: Prisma.InputJsonValue;
}

export interface CreateOpcionEventoInput {
  eventoId: number;
  codigoOpcion: string;
  texto: string;
  clasificacion: ClasificacionOpcionSimulacion;
  siguienteEventoId?: number | null;
  cambiosSimulados?: Prisma.InputJsonValue;
}

export interface CreateEstadoSimulacionEmpresaInput {
  simulacionEmpresaId: number;
  variables: Prisma.InputJsonValue;
  historialEventos: Prisma.InputJsonValue;
}

export interface CreateSimulacionEmpresaConGrafoInput {
  simulacionId: number;
  empresaId: number;
  estructura: EstructuraSimulacionGeneradaIA;
  variablesIniciales?: Prisma.InputJsonValue;
}

export async function findEmpresasActivasConAlumnosYProductos(
  cursoId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.empresa.findMany({
    where: {
      idCurso: cursoId,
      activo: true,
    },
    include: {
      alumnos: {
        include: {
          usuario: true,
          rolEmpresa: true,
        },
      },
      productos: {
        where: { activo: true },
        select: {
          nombre: true,
          stock: true,
          precioVenta: true,
          activo: true,
        },
      },
      ordenesProduccion: {
        where: {
          estado: {
            nombre: ESTADOS_PRODUCCION.FINALIZADA,
          },
        },
        select: {
          cantidad: true,
          createdAt: true,
          historialEstados: {
            select: {
              estado: { select: { nombre: true } },
              fechaInicio: true,
              fechaFin: true,
            },
          },
        },
        take: 10,
      },
    },
  });
}

export type EmpresaSimulacionEntity = Prisma.PromiseReturnType<
  typeof findEmpresasActivasConAlumnosYProductos
>[number];

export async function createSimulacion(data: CreateSimulacionInput, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.simulacion.create({
    data: {
      docenteId: data.docenteId,
      cursoId: data.cursoId,
      titulo: data.titulo,
      flujoEmpresarial: data.flujoEmpresarial,
      dificultad: data.dificultad,
      duracion: data.duracion,
      eventosSorpresa: data.eventosSorpresa,
      usarDatosEmpresa: data.usarDatosEmpresa,
      fechaLimite: data.fechaLimite,
      estado: data.estado ?? EstadoSimulacion.PUBLICADA,
    },
    include: {
      curso: {
        select: {
          idCurso: true,
          nombreCurso: true,
          año: true,
        },
      },
    },
  });
}

export type SimulacionCreadaEntity = Prisma.PromiseReturnType<typeof createSimulacion>;

export async function createSimulacionEmpresa(
  data: CreateSimulacionEmpresaInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.simulacionEmpresa.create({
    data: {
      simulacionId: data.simulacionId,
      empresaId: data.empresaId,
      estado: data.estado ?? EstadoParticipacionSimulacion.PENDIENTE,
      situacionInicial: data.situacionInicial,
    },
  });
}

export async function createEventoSimulacion(
  data: CreateEventoSimulacionInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.eventoSimulacion.create({
    data: {
      simulacionEmpresaId: data.simulacionEmpresaId,
      codigoEvento: data.codigoEvento,
      tipo: data.tipo,
      emisor: data.emisor,
      mensaje: data.mensaje,
      esSorpresa: data.esSorpresa,
      ...(data.rolesHabilitados !== undefined ? { rolesHabilitados: data.rolesHabilitados } : {}),
    },
  });
}

export async function updateSiguienteEvento(
  idEvento: number,
  siguienteEventoId: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.eventoSimulacion.update({
    where: { idEvento },
    data: { siguienteEventoId },
  });
}

export async function createOpcionEvento(
  data: CreateOpcionEventoInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.opcionEvento.create({
    data: {
      eventoId: data.eventoId,
      codigoOpcion: data.codigoOpcion,
      texto: data.texto,
      clasificacion: data.clasificacion,
      siguienteEventoId: data.siguienteEventoId ?? null,
      ...(data.cambiosSimulados !== undefined ? { cambiosSimulados: data.cambiosSimulados } : {}),
    },
  });
}

export async function updateEventosInicialYActual(
  idSimulacionEmpresa: number,
  eventoInicialId: number | null,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.simulacionEmpresa.update({
    where: { idSimulacionEmpresa },
    data: {
      eventoInicialId,
      eventoActualId: eventoInicialId,
    },
  });
}

export async function createEstadoSimulacionEmpresa(
  data: CreateEstadoSimulacionEmpresaInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.estadoSimulacionEmpresa.create({
    data: {
      simulacionEmpresaId: data.simulacionEmpresaId,
      variables: data.variables,
      historialEventos: data.historialEventos,
    },
  });
}

export async function createSimulacionEmpresaConGrafo(
  data: CreateSimulacionEmpresaConGrafoInput,
  tx?: Prisma.TransactionClient
) {
  const { simulacionId, empresaId, estructura } = data;

  // 1. Crear registro de empresa en la simulación
  const simulacionEmpresa = await createSimulacionEmpresa(
    {
      simulacionId,
      empresaId,
      situacionInicial: estructura.contextoInicial || '',
    },
    tx
  );

  // 2. Mapa para traducir IDs temporales ("E1", "E2") a IDs numéricos de base de datos
  const mapaCodigoAId = new Map<string, number>();

  // 3. Crear eventos
  for (const ev of estructura.eventos) {
    const eventoCreado = await createEventoSimulacion(
      {
        simulacionEmpresaId: simulacionEmpresa.idSimulacionEmpresa,
        codigoEvento: ev.id,
        tipo: (ev.tipo as TipoEventoSimulacion) || TipoEventoSimulacion.DECISION,
        emisor: ev.emisor || 'ABA',
        mensaje: ev.mensaje,
        esSorpresa: Boolean(ev.esSorpresa),
        rolesHabilitados: ev.rolesHabilitados || [],
      },
      tx
    );
    mapaCodigoAId.set(ev.id, eventoCreado.idEvento);
  }

  // 4. Crear opciones y enlazar saltos entre eventos
  for (const ev of estructura.eventos) {
    const eventoIdActual = mapaCodigoAId.get(ev.id);
    if (!eventoIdActual) continue;

    if (ev.siguienteEventoId && mapaCodigoAId.has(ev.siguienteEventoId)) {
      const sigId = mapaCodigoAId.get(ev.siguienteEventoId);
      if (sigId !== undefined) {
        await updateSiguienteEvento(eventoIdActual, sigId, tx);
      }
    }

    if (ev.opciones && Array.isArray(ev.opciones)) {
      for (const op of ev.opciones) {
        const destinoId = op.siguienteEventoId
          ? (mapaCodigoAId.get(op.siguienteEventoId) ?? null)
          : null;

        await createOpcionEvento(
          {
            eventoId: eventoIdActual,
            codigoOpcion: op.id,
            texto: op.texto,
            clasificacion:
              (op.clasificacion as ClasificacionOpcionSimulacion) ||
              ClasificacionOpcionSimulacion.ADECUADA,
            siguienteEventoId: destinoId,
            cambiosSimulados: op.cambiosSimulados ? (op.cambiosSimulados as any) : undefined,
          },
          tx
        );
      }
    }
  }

  // 5. Configurar evento inicial y actual
  const eventoInicialId = mapaCodigoAId.get(estructura.eventoInicialId) ?? null;
  await updateEventosInicialYActual(simulacionEmpresa.idSimulacionEmpresa, eventoInicialId, tx);

  // 6. Crear registro de estado interno simulado
  await createEstadoSimulacionEmpresa(
    {
      simulacionEmpresaId: simulacionEmpresa.idSimulacionEmpresa,
      variables: data.variablesIniciales ?? {},
      historialEventos: [],
    },
    tx
  );

  return simulacionEmpresa;
}

export async function findSimulacionesDocentePaginadas(
  docenteId: string,
  filtros: ObtenerSimulacionesDocenteQueryDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const page = filtros.page ?? 1;
  const pageSize = filtros.pageSize ?? 6;
  const titulo = filtros.titulo?.trim();

  const where: Prisma.SimulacionWhereInput = {
    docenteId,
  };

  if (filtros.cursoId) {
    where.cursoId = filtros.cursoId;
  }

  if (titulo) {
    where.titulo = {
      contains: titulo,
      mode: 'insensitive',
    };
  }

  if (filtros.estado) {
    if (filtros.estado === 'PENDIENTE') {
      where.empresas = {
        none: {
          estado: {
            in: [EstadoParticipacionSimulacion.EN_CURSO, EstadoParticipacionSimulacion.FINALIZADA],
          },
        },
      };
    } else if (filtros.estado === 'FINALIZADA') {
      where.empresas = {
        some: {},
        none: {
          estado: {
            not: EstadoParticipacionSimulacion.FINALIZADA,
          },
        },
      };
    } else if (filtros.estado === 'EN_CURSO') {
      where.AND = [
        {
          empresas: {
            some: {
              estado: {
                in: [
                  EstadoParticipacionSimulacion.EN_CURSO,
                  EstadoParticipacionSimulacion.FINALIZADA,
                ],
              },
            },
          },
        },
        {
          empresas: {
            some: {
              estado: {
                not: EstadoParticipacionSimulacion.FINALIZADA,
              },
            },
          },
        },
      ];
    }
  }

  const baseResumenWhere: Prisma.SimulacionWhereInput = {
    docenteId,
    ...(filtros.cursoId ? { cursoId: filtros.cursoId } : {}),
  };

  const [items, totalItems, totalDocente, pendientesDocente, enCursoDocente, finalizadasDocente] =
    await Promise.all([
      db.simulacion.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          idSimulacion: true,
          titulo: true,
          fechaLimite: true,
          createdAt: true,
          updatedAt: true,
          curso: {
            select: {
              idCurso: true,
              nombreCurso: true,
            },
          },
          empresas: {
            select: {
              idSimulacionEmpresa: true,
              estado: true,
              puntajeFinal: true,
            },
          },
        },
      }),

      db.simulacion.count({ where }),

      db.simulacion.count({ where: baseResumenWhere }),

      db.simulacion.count({
        where: {
          ...baseResumenWhere,
          empresas: {
            none: {
              estado: {
                in: [
                  EstadoParticipacionSimulacion.EN_CURSO,
                  EstadoParticipacionSimulacion.FINALIZADA,
                ],
              },
            },
          },
        },
      }),

      db.simulacion.count({
        where: {
          ...baseResumenWhere,
          AND: [
            {
              empresas: {
                some: {
                  estado: {
                    in: [
                      EstadoParticipacionSimulacion.EN_CURSO,
                      EstadoParticipacionSimulacion.FINALIZADA,
                    ],
                  },
                },
              },
            },
            {
              empresas: {
                some: {
                  estado: {
                    not: EstadoParticipacionSimulacion.FINALIZADA,
                  },
                },
              },
            },
          ],
        },
      }),

      db.simulacion.count({
        where: {
          ...baseResumenWhere,
          empresas: {
            some: {},
            none: {
              estado: {
                not: EstadoParticipacionSimulacion.FINALIZADA,
              },
            },
          },
        },
      }),
    ]);

  return {
    items,
    totalItems,
    resumen: {
      total: totalDocente,
      pendientes: pendientesDocente,
      enCurso: enCursoDocente,
      finalizadas: finalizadasDocente,
    },
  };
}

export async function findByIdAndDocenteOrThrow(
  idSimulacion: number,
  docenteId: string,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);
  const simulacion = await db.simulacion.findFirst({
    where: {
      idSimulacion,
      docenteId,
    },
    select: {
      idSimulacion: true,
      docenteId: true,
      cursoId: true,
      titulo: true,
      fechaLimite: true,
      estado: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!simulacion) {
    throw new NotFoundError('Simulación no encontrada.');
  }

  return simulacion;
}

export async function updateTitulo(
  idSimulacion: number,
  titulo: string,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);
  return db.simulacion.update({
    where: { idSimulacion },
    data: { titulo },
    select: {
      idSimulacion: true,
      titulo: true,
      updatedAt: true,
    },
  });
}

export async function findEntregasSimulacion(
  idSimulacion: number,
  docenteId: string,
  filtros: ObtenerEntregasSimulacionQueryDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);
  const page = filtros.page ?? 1;
  const pageSize = filtros.pageSize ?? 6;

  // 1. Obtener simulación con cabecera y progreso de todas las empresas participantes
  const simulacion = await db.simulacion.findFirst({
    where: {
      idSimulacion,
      docenteId,
    },
    select: {
      idSimulacion: true,
      docenteId: true,
      cursoId: true,
      titulo: true,
      flujoEmpresarial: true,
      fechaLimite: true,
      curso: {
        select: {
          idCurso: true,
          nombreCurso: true,
        },
      },
      empresas: {
        select: {
          idSimulacionEmpresa: true,
          estado: true,
          puntajeFinal: true,
          fechaFinalizacion: true,
          _count: {
            select: {
              eventos: true,
            },
          },
        },
      },
    },
  });

  if (!simulacion) {
    throw new NotFoundError('Simulación no encontrada.');
  }

  // 2. Calcular métricas globales para la cabecera
  const empresasTotales = simulacion.empresas.length;
  const empresasQueHanEmpezado = simulacion.empresas.filter(
    (e) =>
      e.estado === EstadoParticipacionSimulacion.EN_CURSO ||
      e.estado === EstadoParticipacionSimulacion.FINALIZADA
  ).length;
  const finalizadas = simulacion.empresas.filter(
    (e) => e.estado === EstadoParticipacionSimulacion.FINALIZADA
  );
  const empresasFinalizadas = finalizadas.length;

  let puntajePromedio: number | null = null;
  if (empresasFinalizadas > 0) {
    const totalPuntos = finalizadas.reduce((acc, e) => acc + (e.puntajeFinal ?? 0), 0);
    puntajePromedio = Math.round(totalPuntos / empresasFinalizadas);
  }

  let estado: 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADA' = 'PENDIENTE';
  if (empresasTotales > 0 && empresasFinalizadas === empresasTotales) {
    estado = 'FINALIZADA';
  } else if (empresasQueHanEmpezado > 0) {
    estado = 'EN_CURSO';
  }

  let fechaFinalizacion: Date | null = null;
  if (finalizadas.length > 0) {
    const fechas = finalizadas
      .map((e) => e.fechaFinalizacion)
      .filter((f): f is Date => f !== null)
      .sort((a, b) => b.getTime() - a.getTime());
    if (fechas.length > 0 && fechas[0]) {
      fechaFinalizacion = fechas[0];
    }
  }

  const cantEventosTotales = simulacion.empresas[0]?._count.eventos ?? 0;

  const cabecera = {
    idSimulacion: simulacion.idSimulacion,
    titulo: simulacion.titulo,
    estado,
    curso: {
      idCurso: simulacion.curso.idCurso,
      nombreCurso: simulacion.curso.nombreCurso,
    },
    fechaLimite: simulacion.fechaLimite.toISOString(),
    fechaFinalizacion: fechaFinalizacion?.toISOString() ?? null,
    tema: simulacion.flujoEmpresarial,
    cantEventosTotales,
    empresasTotales,
    empresasQueHanEmpezado,
    puntajePromedio,
  };

  // 3. Filtros para la paginación de empresas
  const where: Prisma.SimulacionEmpresaWhereInput = {
    simulacionId: idSimulacion,
  };

  if (filtros.search) {
    where.empresa = {
      nombre: {
        contains: filtros.search,
        mode: 'insensitive',
      },
    };
  }

  if (filtros.estado && filtros.estado !== 'TODAS') {
    where.estado = filtros.estado as EstadoParticipacionSimulacion;
  }

  // 4. Consulta paginada de empresas participantes
  const [items, totalItems] = await Promise.all([
    db.simulacionEmpresa.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [{ estado: 'asc' }, { empresa: { nombre: 'asc' } }],
      select: {
        idSimulacionEmpresa: true,
        empresaId: true,
        estado: true,
        puntajeFinal: true,
        fechaInicio: true,
        fechaFinalizacion: true,
        empresa: {
          select: {
            id: true,
            nombre: true,
            logoUrl: true,
            alumnos: {
              select: {
                id: true,
                rolEmpresa: {
                  select: {
                    idRol: true,
                    nombreRol: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            eventos: true,
            decisiones: true,
          },
        },
        decisiones: {
          orderBy: {
            fechaDecision: 'desc',
          },
          take: 1,
          select: {
            fechaDecision: true,
            rolEmpresa: {
              select: {
                nombreRol: true,
              },
            },
          },
        },
      },
    }),
    db.simulacionEmpresa.count({ where }),
  ]);

  return {
    cabecera,
    items,
    totalItems,
    page,
    pageSize,
  };
}

export interface SimulacionAlumnoListItemEntity {
  idSimulacionEmpresa: number;
  estado: EstadoParticipacionSimulacion;
  fechaInicio: Date | null;
  fechaFinalizacion: Date | null;
  simulacion: {
    titulo: string;
    fechaLimite: Date;
    usarDatosEmpresa: boolean;
  };
  empresa: {
    nombre: string;
  };
  estadoInterno: {
    variables: Prisma.JsonValue;
  } | null;
  eventoActual: {
    idEvento: number;
    tipo: TipoEventoSimulacion;
    rolesHabilitados: Prisma.JsonValue | null;
  } | null;
  _count: {
    eventos: number;
    decisiones: number;
  };
  decisiones: {
    fechaDecision: Date;
  }[];
}

export interface ResumenDashboardAlumnoDTO {
  total: number;
  pendientes: number;
  enCurso: number;
  finalizadas: number;
  decisionesPorResponder: number;
}

export async function findSimulacionesAlumnoPaginadas(
  empresaId: number,
  rolAlumno: string | null,
  filtros: ObtenerSimulacionesAlumnoQueryDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const page = filtros.page ?? 1;
  const pageSize = filtros.pageSize ?? 6;
  const titulo = filtros.titulo?.trim();

  const where: Prisma.SimulacionEmpresaWhereInput = {
    empresaId,
  };

  if (titulo) {
    where.simulacion = {
      titulo: {
        contains: titulo,
        mode: 'insensitive',
      },
    };
  }

  if (filtros.estado) {
    if (filtros.estado === 'PENDIENTE') {
      where.estado = EstadoParticipacionSimulacion.PENDIENTE;
    } else if (filtros.estado === 'FINALIZADA') {
      where.estado = EstadoParticipacionSimulacion.FINALIZADA;
    } else if (filtros.estado === 'EN_CURSO') {
      where.estado = EstadoParticipacionSimulacion.EN_CURSO;
    } else if (filtros.estado === 'REQUIERE_MI_DECISION') {
      where.estado = EstadoParticipacionSimulacion.EN_CURSO;
      where.eventoActual = {
        tipo: TipoEventoSimulacion.DECISION,
        OR: [
          ...(rolAlumno
            ? [
                {
                  rolesHabilitados: {
                    array_contains: rolAlumno,
                  },
                },
              ]
            : []),
          {
            rolesHabilitados: {
              array_contains: 'TODOS',
            },
          },
        ],
      };
    }
  }

  const baseResumenWhere: Prisma.SimulacionEmpresaWhereInput = {
    empresaId,
  };

  const decisionesPorResponderWhere: Prisma.SimulacionEmpresaWhereInput = {
    ...baseResumenWhere,
    estado: EstadoParticipacionSimulacion.EN_CURSO,
    eventoActual: {
      tipo: TipoEventoSimulacion.DECISION,
      OR: [
        ...(rolAlumno
          ? [
              {
                rolesHabilitados: {
                  array_contains: rolAlumno,
                },
              },
            ]
          : []),
        {
          rolesHabilitados: {
            array_contains: 'TODOS',
          },
        },
      ],
    },
  };

  const [
    items,
    totalItems,
    totalEmpresa,
    pendientesEmpresa,
    enCursoEmpresa,
    finalizadasEmpresa,
    decisionesPorResponderEmpresa,
  ] = await Promise.all([
    db.simulacionEmpresa.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        simulacion: {
          createdAt: 'desc',
        },
      },
      select: {
        idSimulacionEmpresa: true,
        estado: true,
        fechaInicio: true,
        fechaFinalizacion: true,
        simulacion: {
          select: {
            titulo: true,
            fechaLimite: true,
            usarDatosEmpresa: true,
          },
        },
        empresa: {
          select: {
            nombre: true,
          },
        },
        estadoInterno: {
          select: {
            variables: true,
          },
        },
        eventoActual: {
          select: {
            idEvento: true,
            tipo: true,
            rolesHabilitados: true,
          },
        },
        _count: {
          select: {
            eventos: true,
            decisiones: true,
          },
        },
        decisiones: {
          orderBy: {
            fechaDecision: 'desc',
          },
          take: 1,
          select: {
            fechaDecision: true,
          },
        },
      },
    }),

    db.simulacionEmpresa.count({ where }),

    db.simulacionEmpresa.count({ where: baseResumenWhere }),

    db.simulacionEmpresa.count({
      where: {
        ...baseResumenWhere,
        estado: EstadoParticipacionSimulacion.PENDIENTE,
      },
    }),

    db.simulacionEmpresa.count({
      where: {
        ...baseResumenWhere,
        estado: EstadoParticipacionSimulacion.EN_CURSO,
      },
    }),

    db.simulacionEmpresa.count({
      where: {
        ...baseResumenWhere,
        estado: EstadoParticipacionSimulacion.FINALIZADA,
      },
    }),

    db.simulacionEmpresa.count({
      where: decisionesPorResponderWhere,
    }),
  ]);

  return {
    items: items as SimulacionAlumnoListItemEntity[],
    totalItems,
    resumen: {
      total: totalEmpresa,
      pendientes: pendientesEmpresa,
      enCurso: enCursoEmpresa,
      finalizadas: finalizadasEmpresa,
      decisionesPorResponder: decisionesPorResponderEmpresa,
    },
  };
}

export async function findConversacionSimulacionEmpresa(
  idSimulacionEmpresa: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.simulacionEmpresa.findUnique({
    where: { idSimulacionEmpresa },
    include: {
      simulacion: {
        select: {
          idSimulacion: true,
          titulo: true,
          flujoEmpresarial: true,
          dificultad: true,
          duracion: true,
          fechaLimite: true,
          usarDatosEmpresa: true,
          cursoId: true,
          docenteId: true,
        },
      },
      empresa: {
        select: {
          id: true,
          nombre: true,
          logoUrl: true,
          alumnos: {
            select: {
              id: true,
              idRolEmpresa: true,
              rolEmpresa: {
                select: {
                  idRol: true,
                  nombreRol: true,
                },
              },
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  fotoPerfilUrl: true,
                },
              },
            },
          },
        },
      },
      estadoInterno: {
        select: {
          variables: true,
          historialEventos: true,
        },
      },
      eventoInicial: true,
      eventoActual: {
        include: {
          opciones: {
            orderBy: {
              codigoOpcion: 'asc',
            },
          },
        },
      },
      eventos: {
        include: {
          opciones: true,
        },
      },
      decisiones: {
        orderBy: {
          fechaDecision: 'asc',
        },
        include: {
          evento: true,
          opcion: true,
          alumno: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  fotoPerfilUrl: true,
                },
              },
            },
          },
          rolEmpresa: {
            select: {
              idRol: true,
              nombreRol: true,
            },
          },
        },
      },
      _count: {
        select: {
          eventos: true,
          decisiones: true,
        },
      },
    },
  });
}

export async function iniciarSimulacionEmpresa(
  idSimulacionEmpresa: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.simulacionEmpresa.update({
    where: { idSimulacionEmpresa },
    data: {
      estado: EstadoParticipacionSimulacion.EN_CURSO,
      fechaInicio: new Date(),
    },
  });
}

export type ConversacionSimulacionEmpresaEntity = NonNullable<
  Prisma.PromiseReturnType<typeof findConversacionSimulacionEmpresa>
>;

export interface CreateDecisionSimulacionInput {
  simulacionEmpresaId: number;
  eventoId: number;
  opcionId: number;
  alumnoId: string;
  rolEmpresaId: number;
  puntosObtenidos: number;
}

export interface ActualizarProgresoSimulacionInput {
  estado: EstadoParticipacionSimulacion;
  eventoActualId: number | null;
  fechaInicio?: Date | undefined;
  fechaFinalizacion?: Date | undefined;
  puntajeFinal?: number | undefined;
}

export async function findSimulacionEmpresaParaResponder(
  idSimulacionEmpresa: number,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.simulacionEmpresa.findUnique({
    where: { idSimulacionEmpresa },
    select: {
      idSimulacionEmpresa: true,
      empresaId: true,
      estado: true,
      eventoActualId: true,
      fechaInicio: true,
      simulacion: {
        select: {
          idSimulacion: true,
          fechaLimite: true,
        },
      },
      eventoActual: {
        include: {
          opciones: true,
        },
      },
      estadoInterno: {
        select: {
          idEstado: true,
          variables: true,
          historialEventos: true,
        },
      },
      decisiones: {
        select: {
          idDecision: true,
          eventoId: true,
          puntosObtenidos: true,
        },
      },
    },
  });
}

export async function findEventoById(idEvento: number, tx?: Prisma.TransactionClient) {
  const db = getDbClient(tx);

  return db.eventoSimulacion.findUnique({
    where: { idEvento },
    select: {
      idEvento: true,
      tipo: true,
      siguienteEventoId: true,
    },
  });
}

export async function createDecisionSimulacion(
  data: CreateDecisionSimulacionInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.decisionSimulacion.create({
    data: {
      simulacionEmpresaId: data.simulacionEmpresaId,
      eventoId: data.eventoId,
      opcionId: data.opcionId,
      alumnoId: data.alumnoId,
      rolEmpresaId: data.rolEmpresaId,
      puntosObtenidos: data.puntosObtenidos,
    },
  });
}

export async function updateEstadoSimulacionEmpresaVariables(
  idSimulacionEmpresa: number,
  variables: Record<string, unknown>,
  historialEventos: unknown[],
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.estadoSimulacionEmpresa.update({
    where: { simulacionEmpresaId: idSimulacionEmpresa },
    data: {
      variables: variables as Prisma.InputJsonValue,
      historialEventos: historialEventos as Prisma.InputJsonValue,
    },
  });
}

export async function actualizarProgresoSimulacionEmpresa(
  idSimulacionEmpresa: number,
  data: ActualizarProgresoSimulacionInput,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.simulacionEmpresa.update({
    where: { idSimulacionEmpresa },
    data: {
      estado: data.estado,
      eventoActualId: data.eventoActualId,
      ...(data.fechaInicio ? { fechaInicio: data.fechaInicio } : {}),
      ...(data.fechaFinalizacion ? { fechaFinalizacion: data.fechaFinalizacion } : {}),
      ...(data.puntajeFinal !== undefined ? { puntajeFinal: data.puntajeFinal } : {}),
    },
  });
}

export type SimulacionEmpresaParaResponderEntity = NonNullable<
  Prisma.PromiseReturnType<typeof findSimulacionEmpresaParaResponder>
>;
