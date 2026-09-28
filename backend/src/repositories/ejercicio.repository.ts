import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { CrearEjercicioDTO, ObtenerEjerciciosQueryDTO } from '../validators/ejercicio.validator';

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
      estado: data.estado,
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
        estado: 'PENDIENTE',
      };
    } else if (filtros.estado === 'RESUELTO') {
      where.estado = 'PUBLICADO';
      where.resolucion = {
        estado: 'COMPLETADA',
      };
    } else {
      where.estado = filtros.estado;
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
          resolucion: { estado: 'PENDIENTE' },
        },
      }),
      db.ejercicio.count({
        where: {
          docenteId,
          estado: 'PUBLICADO',
          resolucion: { estado: 'COMPLETADA' },
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
    throw new Error('Ejercicio no encontrado.');
  }

  return ejercicio;
}
