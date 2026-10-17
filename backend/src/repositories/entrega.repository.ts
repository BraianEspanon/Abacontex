import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { ObtenerEntregasAlumnoQueryDTO } from '../validators/entrega.validator';

export type EjercicioTableroAlumnoEntity = Prisma.EjercicioGetPayload<{
  include: {
    docente: {
      select: {
        id: true;
        nombre: true;
        apellido: true;
      };
    };
    plantillas: {
      select: {
        idEjercicioPlantilla: true;
        tipo: true;
      };
    };
    entregas: {
      include: {
        resoluciones: {
          select: {
            idResolucionPlantilla: true;
            ejercicioPlantillaId: true;
            estado: true;
          };
        };
        correccion: {
          select: {
            idCorreccion: true;
            fechaCorreccion: true;
          };
        };
      };
    };
  };
}>;

export async function findEjerciciosParaTableroAlumno(
  cursoId: number,
  alumnoId: string,
  filtros: Pick<ObtenerEntregasAlumnoQueryDTO, 'busqueda' | 'docenteId'>,
  tx?: Prisma.TransactionClient
): Promise<EjercicioTableroAlumnoEntity[]> {
  const db = getDbClient(tx);

  const where: Prisma.EjercicioWhereInput = {
    cursoId,
    estado: 'PUBLICADO',
  };

  if (filtros.busqueda) {
    where.titulo = {
      contains: filtros.busqueda,
      mode: 'insensitive',
    };
  }

  if (filtros.docenteId) {
    where.docenteId = filtros.docenteId;
  }

  return db.ejercicio.findMany({
    where,
    orderBy: {
      fechaLimite: 'asc',
    },
    include: {
      docente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
        },
      },
      plantillas: {
        select: {
          idEjercicioPlantilla: true,
          tipo: true,
        },
      },
      entregas: {
        where: {
          alumnoId,
        },
        include: {
          resoluciones: {
            select: {
              idResolucionPlantilla: true,
              ejercicioPlantillaId: true,
              estado: true,
            },
          },
          correccion: {
            select: {
              idCorreccion: true,
              fechaCorreccion: true,
            },
          },
        },
      },
    },
  });
}

export type DocenteCursoEntity = {
  id: string;
  nombre: string;
  apellido: string;
};

export async function findDocentesPorCurso(
  cursoId: number,
  tx?: Prisma.TransactionClient
): Promise<DocenteCursoEntity[]> {
  const db = getDbClient(tx);

  return db.usuario.findMany({
    where: {
      OR: [
        {
          profesorCursos: {
            some: {
              idCurso: cursoId,
            },
          },
        },
        {
          ejerciciosCreados: {
            some: {
              cursoId,
              estado: 'PUBLICADO',
            },
          },
        },
      ],
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
    },
    orderBy: {
      apellido: 'asc',
    },
  });
}

