import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export async function findBynombre(nombre: string) {
  return prisma.empresa.findUnique({
    where: {
      nombre,
    },
  });
}

export async function update(
  id: number,
  nombre: string,
  actividad: string,
  logoUrl: string | null
) {
  return prisma.empresa.update({
    where: {
      id,
    },
    data: {
      nombre: nombre,
      actividad: actividad,
      logoUrl: logoUrl,
    },
  });
}

export async function create(
  nombre: string,
  actividad: string,
  logoUrl: string | null,
  idCurso: number,
  idCicloLectivo: number,
  idUsuario: string
) {
  return prisma.$transaction(async (tx) => {
    const empresa = await tx.empresa.create({
      data: {
        nombre: nombre,
        actividad: actividad,
        logoUrl: logoUrl ?? null,
        puntos: 0,
        idCurso: idCurso,
        idCicloLectivo: idCicloLectivo,
      },
    });

    await tx.alumno.update({
      where: {
        id: idUsuario,
      },
      data: {
        idEmpresa: empresa.id,
      },
    });

    return empresa;
  });
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
