import { prisma, getDbClient } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { ActualizarEmpresaDTO, CrearEmpresaDTO } from '../validators/empresa.validator';
import { NotFoundError } from '../errors/not-found.error';
import { Empresa } from '@prisma/client';

export async function findBynombre(nombre: string) {
  return prisma.empresa.findUnique({
    where: {
      nombre,
    },
  });
}

type ActualizarEmpresaPersistenceDTO = ActualizarEmpresaDTO & {
  logoUrl: string | null;
  logoPublicId: string | null;
};

export async function update(
  id: number,
  data: ActualizarEmpresaPersistenceDTO,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);
  return db.empresa.update({
    where: {
      id,
    },
    data: {
      nombre: data.nombre,
      actividad: data.actividad,
      logoUrl: data.logoUrl,
      logoPublicId: data.logoPublicId,
    },
  });
}

type CrearEmpresaPersistenceDTO = CrearEmpresaDTO & {
  logoUrl: string | null;
  logoPublicId: string | null;
};

export async function create(
  data: CrearEmpresaPersistenceDTO,
  idCurso: number,
  idCicloLectivo: number,
  idUsuario: string,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const empresa = await db.empresa.create({
    data: {
      nombre: data.nombre,
      actividad: data.actividad,
      logoUrl: data.logoUrl,
      logoPublicId: data.logoPublicId,
      puntos: 0,
      idCurso: idCurso,
      idCicloLectivo: idCicloLectivo,
    },
  });

  await db.alumno.update({
    where: {
      id: idUsuario,
    },
    data: {
      idEmpresa: empresa.id,
    },
  });

  return empresa;
}

export async function findByIdWithAlumnos(idEmpresa: number) {
  return prisma.empresa.findUnique({
    where: {
      id: idEmpresa,
    },
    include: {
      alumnos: true,
    },
  });
}
export async function findByIdWithAlumnosOrThrow(idEmpresa: number) {
  const empresa = await findByIdWithAlumnos(idEmpresa);

  if (!empresa) {
    throw new NotFoundError('Empresa no encontrada en base de datos.', {
      idEmpresa,
    });
  }

  return empresa;
}
export async function countByCursos(cursoIds: number[]): Promise<number> {
  return prisma.empresa.count({
    where: {
      idCurso: {
        in: cursoIds,
      },
    },
  });
}

export async function countByCurso(idCurso: number): Promise<number> {
  return prisma.empresa.count({
    where: {
      idCurso,
    },
  });
}

export async function findByDocente(
  keycloakId: string,
  search: string | undefined,
  idCurso: number | undefined,
  page: number,
  pageSize: number
) {
  const where: Prisma.EmpresaWhereInput = {
    curso: {
      profesores: {
        some: {
          profesor: {
            keycloakId,
          },
        },
      },
    },
  };

  if (idCurso) {
    where.idCurso = idCurso;
  }

  if (search) {
    where.OR = [
      {
        nombre: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        alumnos: {
          some: {
            usuario: {
              OR: [
                {
                  nombre: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  apellido: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        },
      },
    ];
  }

  const [totalItems, items] = await prisma.$transaction([
    prisma.empresa.count({
      where,
    }),

    prisma.empresa.findMany({
      where,

      select: {
        id: true,

        nombre: true,

        actividad: true,

        logoUrl: true,

        curso: {
          select: {
            idCurso: true,
            nombreCurso: true,
          },
        },

        alumnos: {
          select: {
            usuario: {
              select: {
                email: true,
              },
            },
          },
        },
      },

      orderBy: {
        nombre: 'asc',
      },

      skip: (page - 1) * pageSize,

      take: pageSize,
    }),
  ]);

  return {
    totalItems,
    items,
  };
}

export async function findDetalleByDocente(keycloakId: string, empresaId: number) {
  return prisma.empresa.findFirst({
    where: {
      id: empresaId,

      curso: {
        profesores: {
          some: {
            profesor: {
              keycloakId,
            },
          },
        },
      },
    },

    select: {
      id: true,

      nombre: true,

      actividad: true,

      logoUrl: true,

      curso: {
        select: {
          idCurso: true,
          nombreCurso: true,
        },
      },

      alumnos: {
        select: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },

          rolEmpresa: {
            select: {
              nombreRol: true,
            },
          },
        },
      },
    },
  });
}

export async function findMineOrThrow(keycloakId: string): Promise<Empresa> {
  const empresa = await prisma.empresa.findFirst({
    where: {
      alumnos: {
        some: {
          usuario: {
            keycloakId,
          },
        },
      },
    },
    include: {
      alumnos: {
        include: {
          usuario: true,
          rolEmpresa: true,
        },
      },
    },
  });

  if (!empresa) {
    throw new NotFoundError('El usuario no pertenece a ninguna empresa');
  }

  return empresa;
}
