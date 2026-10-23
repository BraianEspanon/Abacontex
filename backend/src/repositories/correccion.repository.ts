import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { ObtenerEjerciciosACorregirQueryDTO } from '../validators/correccion.validator';

export type EjercicioTableroCorreccionEntity = Prisma.EjercicioGetPayload<{
  include: {
    curso: {
      select: {
        idCurso: true;
        nombreCurso: true;
        _count: {
          select: {
            alumnos: true;
          };
        };
      };
    };
    entregas: {
      where: {
        fechaEntrega: { not: null };
      };
      select: {
        idEntrega: true;
        fechaEntrega: true;
        correccion: {
          select: {
            idCorreccion: true;
            fechaCorreccion: true;
            plantillas: {
              select: {
                idCorreccionPlantilla: true;
                estado: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export async function findEjerciciosParaTableroCorreccion(
  docenteId: string,
  filtros: Pick<ObtenerEjerciciosACorregirQueryDTO, 'busqueda' | 'cursoId'>,
  tx?: Prisma.TransactionClient
): Promise<EjercicioTableroCorreccionEntity[]> {
  const db = getDbClient(tx);

  const where: Prisma.EjercicioWhereInput = {
    docenteId,
    estado: { in: ['PUBLICADO', 'FINALIZADO'] },
    entregas: {
      some: {
        fechaEntrega: { not: null },
      },
    },
  };

  if (filtros.cursoId) {
    where.cursoId = filtros.cursoId;
  }

  if (filtros.busqueda) {
    where.titulo = {
      contains: filtros.busqueda,
      mode: 'insensitive',
    };
  }

  return db.ejercicio.findMany({
    where,
    orderBy: {
      fechaLimite: 'desc',
    },
    include: {
      curso: {
        select: {
          idCurso: true,
          nombreCurso: true,
          _count: {
            select: {
              alumnos: true,
            },
          },
        },
      },
      entregas: {
        where: {
          fechaEntrega: { not: null },
        },
        select: {
          idEntrega: true,
          fechaEntrega: true,
          correccion: {
            select: {
              idCorreccion: true,
              fechaCorreccion: true,
              plantillas: {
                select: {
                  idCorreccionPlantilla: true,
                  estado: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
