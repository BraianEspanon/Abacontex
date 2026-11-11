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
import type { EstructuraSimulacionGeneradaIA } from '../integrations/simulacion-ia/simulacion-ia.types';
import type { ObtenerSimulacionesDocenteQueryDTO } from '../validators/simulacion.validator';

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
