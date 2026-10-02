import { EstadoEjercicio, EstadoResolucionEjercicio, Prisma } from '@prisma/client';
import { getDbClient, prisma } from '../lib/prisma';
import { TipoPlantilla } from '../constants/ejercicio.constants';
import { CrearEjercicioDTO, ObtenerEjerciciosQueryDTO } from '../validators/ejercicio.validator';

import { NotFoundError } from '../errors/not-found.error';

const ejercicioCreadoInclude = {
  curso: true,
  plantillas: true,
  generacionIA: {
    include: {
      contenidos: true,
    },
  },
  resolucion: true,
} as const;

export type EjercicioCreadoEntity = Prisma.EjercicioGetPayload<{
  include: typeof ejercicioCreadoInclude;
}>;

export type EjercicioDetalleEntity = EjercicioCreadoEntity;

const ejercicioResolucionInclude = {
  plantillas: true,
  resolucion: {
    include: {
      plantillas: true,
    },
  },
} as const;

export type EjercicioResolucionEntity = Prisma.EjercicioGetPayload<{
  include: typeof ejercicioResolucionInclude;
}>;

export async function crearEjercicio(
  docenteId: string,
  data: CrearEjercicioDTO,
  fechaLimite: Date,
  tx?: Prisma.TransactionClient
): Promise<EjercicioCreadoEntity> {
  const db = getDbClient(tx);

  return db.ejercicio.create({
    data: {
      docenteId,
      cursoId: data.cursoId,
      titulo: data.titulo,
      enunciado: data.enunciado,
      fechaLimite,
      indicaciones: data.indicaciones ?? null,
      estado: data.estado === 'ENVIADO' ? 'PUBLICADO' : data.estado,
      plantillas: {
        create: data.plantillas.map((tipo) => ({ tipo })),
      },
      resolucion: {
        create: {
          estado: 'PENDIENTE',
        },
      },
      ...(data.generacionIA
        ? {
            generacionIA: {
              create: {
                tipoEjercicio: data.generacionIA.tipoEjercicio,
                dificultad: data.generacionIA.dificultad,
                contextoAdicional: data.generacionIA.contextoAdicional ?? null,
                ...(data.generacionIA.contenidos?.length
                  ? {
                      contenidos: {
                        create: data.generacionIA.contenidos.map((contenido) => ({ contenido })),
                      },
                    }
                  : {}),
              },
            },
          }
        : {}),
    },
    include: ejercicioCreadoInclude,
  });
}

export async function findEjerciciosByDocente(
  docenteId: string,
  filtros: ObtenerEjerciciosQueryDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const where: Prisma.EjercicioWhereInput = {
    docenteId,
  };

  if (filtros.cursoId) {
    where.cursoId = filtros.cursoId;
  }

  if (filtros.titulo) {
    where.titulo = {
      contains: filtros.titulo,
      mode: 'insensitive',
    };
  }

  if (filtros.estado) {
    if (filtros.estado === 'SIN_RESOLVER') {
      where.estado = 'PUBLICADO';
      where.resolucion = {
        estado: { not: 'RESUELTO' },
      };
    } else if (filtros.estado === 'ENVIADO') {
      where.estado = 'PUBLICADO';
      where.resolucion = {
        estado: 'RESUELTO',
      };
    } else if (filtros.estado === 'COMPLETADO') {
      where.estado = 'FINALIZADO';
    } else if (filtros.estado === 'BORRADOR') {
      where.estado = 'BORRADOR';
    }
  }

  const page = filtros.page ?? 1;
  const pageSize = filtros.pageSize ?? 6;

  const [items, totalItems, totalDocente, enviadosDocente, sinResolverDocente, resueltosDocente] =
    await Promise.all([
      db.ejercicio.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          idEjercicio: true,
          titulo: true,
          estado: true,
          fechaLimite: true,
          createdAt: true,
          updatedAt: true,
          curso: {
            select: {
              idCurso: true,
              nombreCurso: true,
              año: true,
            },
          },
          resolucion: {
            select: {
              idResolucion: true,
              estado: true,
            },
          },
        },
      }),

      db.ejercicio.count({ where }),
      db.ejercicio.count({ where: { docenteId } }),
      db.ejercicio.count({ where: { docenteId, estado: 'PUBLICADO' } }),
      db.ejercicio.count({
        where: {
          docenteId,
          estado: 'PUBLICADO',
          resolucion: { estado: { not: 'RESUELTO' } },
        },
      }),
      db.ejercicio.count({
        where: {
          docenteId,
          estado: 'PUBLICADO',
          resolucion: { estado: 'RESUELTO' },
        },
      }),
    ]);

  return {
    items,
    totalItems,
    resumen: {
      total: totalDocente,
      enviados: enviadosDocente,
      sinResolver: sinResolverDocente,
      resueltos: resueltosDocente,
    },
  };
}

export type EjercicioListItemEntity = Awaited<
  ReturnType<typeof findEjerciciosByDocente>
>['items'][number];

export async function findEjercicioById(
  idEjercicio: number,
  tx?: Prisma.TransactionClient
): Promise<EjercicioDetalleEntity | null> {
  const db = getDbClient(tx);

  return db.ejercicio.findUnique({
    where: { idEjercicio },
    include: ejercicioCreadoInclude,
  });
}

export async function findEjercicioByIdOrThrow(
  idEjercicio: number,
  tx?: Prisma.TransactionClient
): Promise<EjercicioDetalleEntity> {
  const ejercicio = await findEjercicioById(idEjercicio, tx);

  if (!ejercicio) {
    throw new NotFoundError('Ejercicio no encontrado.');
  }

  return ejercicio;
}

export async function findEjercicioConResolucionById(
  idEjercicio: number,
  tx?: Prisma.TransactionClient
): Promise<EjercicioResolucionEntity | null> {
  const db = getDbClient(tx);

  return db.ejercicio.findUnique({
    where: { idEjercicio },
    include: ejercicioResolucionInclude,
  });
}

export async function findEjercicioConResolucionByIdOrThrow(
  idEjercicio: number,
  tx?: Prisma.TransactionClient
): Promise<EjercicioResolucionEntity> {
  const ejercicio = await findEjercicioConResolucionById(idEjercicio, tx);

  if (!ejercicio) {
    throw new NotFoundError('Ejercicio no encontrado.');
  }

  return ejercicio;
}

export interface ActualizarEjercicioData {
  titulo?: string | undefined;
  enunciado?: string | undefined;
  cursoId?: number | undefined;
  fechaLimite?: Date | undefined;
  indicaciones?: string | null | undefined;
  estado?: EstadoEjercicio | undefined;
  plantillas?: TipoPlantilla[] | undefined;
}

export async function actualizarEjercicio(
  idEjercicio: number,
  data: ActualizarEjercicioData,
  tx?: Prisma.TransactionClient
): Promise<EjercicioDetalleEntity> {
  const ejecutar = async (client: Prisma.TransactionClient) => {
    if (data.plantillas) {
      await client.ejercicioPlantilla.deleteMany({
        where: { ejercicioId: idEjercicio },
      });
      await client.ejercicioPlantilla.createMany({
        data: data.plantillas.map((tipo) => ({
          ejercicioId: idEjercicio,
          tipo,
        })),
      });
    }

    const updateData: Prisma.EjercicioUpdateInput = {};

    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.enunciado !== undefined) updateData.enunciado = data.enunciado;
    if (data.indicaciones !== undefined) updateData.indicaciones = data.indicaciones;
    if (data.fechaLimite !== undefined) updateData.fechaLimite = data.fechaLimite;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.cursoId !== undefined) {
      updateData.curso = { connect: { idCurso: data.cursoId } };
    }

    return client.ejercicio.update({
      where: { idEjercicio },
      data: updateData,
      include: ejercicioCreadoInclude,
    });
  };

  return tx ? ejecutar(tx) : prisma.$transaction(ejecutar);
}

export interface ActualizarResolucionDocenteData {
  estado?: EstadoResolucionEjercicio | undefined;
  plantilla?: {
    idEjercicioPlantilla: number;
    estado?: EstadoResolucionEjercicio | undefined;
    contenido?: unknown;
  } | undefined;
}

export async function actualizarResolucionDocente(
  idEjercicio: number,
  data: ActualizarResolucionDocenteData,
  tx?: Prisma.TransactionClient
): Promise<EjercicioResolucionEntity> {
  const ejecutar = async (client: Prisma.TransactionClient) => {
    let resolucion = await client.resolucionDocente.findUnique({
      where: { ejercicioId: idEjercicio },
    });

    if (!resolucion) {
      resolucion = await client.resolucionDocente.create({
        data: {
          ejercicioId: idEjercicio,
          estado: data.estado ?? 'EN_EDICION',
        },
      });
    } else if (data.estado !== undefined) {
      resolucion = await client.resolucionDocente.update({
        where: { idResolucion: resolucion.idResolucion },
        data: { estado: data.estado },
      });
    }

    if (data.plantilla) {
      const p = data.plantilla;
      await client.resolucionDocentePlantilla.upsert({
        where: {
          resolucionId_ejercicioPlantillaId: {
            resolucionId: resolucion.idResolucion,
            ejercicioPlantillaId: p.idEjercicioPlantilla,
          },
        },
        update: {
          ...(p.estado !== undefined ? { estado: p.estado } : {}),
          ...(p.contenido !== undefined ? { contenido: p.contenido as Prisma.InputJsonValue } : {}),
        },
        create: {
          resolucionId: resolucion.idResolucion,
          ejercicioPlantillaId: p.idEjercicioPlantilla,
          estado: p.estado ?? 'EN_EDICION',
          contenido: (p.contenido ?? null) as Prisma.InputJsonValue,
        },
      });
    }

    const ejercicioActualizado = await client.ejercicio.findUnique({
      where: { idEjercicio },
      include: ejercicioResolucionInclude,
    });

    if (!ejercicioActualizado) {
      throw new NotFoundError('Ejercicio no encontrado.');
    }

    return ejercicioActualizado;
  };

  return tx ? ejecutar(tx) : prisma.$transaction(ejecutar);
}
