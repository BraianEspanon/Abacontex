import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { AlumnoDocenteFiltrosDTO } from '../validators/docente.validator';
import { NotFoundError } from '../errors/not-found.error';
import { CompletarRegistroDTO } from '../validators/alumno.validator';

export async function findByKeycloakIdWithAlumno(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: {
        include: {
          curso: true,
          rolEmpresa: true,
          empresa: true,
        },
      },
    },
  });
}
export async function findByKeycloakIdWithAlumnoOrThrow(keycloakId: string) {
  const usuario = await findByKeycloakIdWithAlumno(keycloakId);

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return usuario;
}

export async function create(id: string, data: CompletarRegistroDTO) {
  await prisma.alumno.create({
    data: {
      id,
      idCurso: data.idCurso,
      idRolEmpresa: data.idRolEmpresa,
    },
    include: {
      curso: true,
      rolEmpresa: true,
    },
  });
}

export async function findCandidatos(idCurso: number, idUsuario: string, search?: string) {
  return prisma.alumno.findMany({
    where: {
      idCurso,

      idEmpresa: null,

      NOT: {
        id: idUsuario,
      },

      rolEmpresa: {
        nombreRol: {
          not: 'CEO',
        },
      },

      ...(search
        ? {
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
          }
        : {}),
    },

    include: {
      usuario: true,
      rolEmpresa: true,
    },

    orderBy: {
      usuario: {
        apellido: 'asc',
      },
    },
  });
}

export async function findByIds(ids: string[]) {
  return prisma.alumno.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      usuario: true,
      rolEmpresa: true,
    },
  });
}

export async function agregarAEmpresa(ids: string[], idEmpresa: number) {
  return prisma.alumno.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      idEmpresa,
    },
  });
}

export async function findByIdWithEmpresaRol(id: string) {
  return prisma.alumno.findUnique({
    where: {
      id,
    },
    include: {
      empresa: true,
      rolEmpresa: true,
    },
  });
}

export async function findByIdWithEmpresaRolOrThrow(keycloakId: string) {
  const usuario = await findByIdWithEmpresaRol(keycloakId);

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return usuario;
}

export async function updateRolEmpresa(id: string, idRolEmpresa: number) {
  return prisma.alumno.update({
    where: {
      id,
    },
    data: {
      idRolEmpresa,
    },
  });
}

export async function updateRoles(
  roles: {
    idAlumno: string;
    idRolEmpresa: number;
  }[]
) {
  return prisma.$transaction(
    roles.map((rol) =>
      prisma.alumno.update({
        where: {
          id: rol.idAlumno,
        },
        data: {
          idRolEmpresa: rol.idRolEmpresa,
        },
      })
    )
  );
}

export async function countByCursos(cursoIds: number[]): Promise<number> {
  return prisma.alumno.count({
    where: {
      idCurso: {
        in: cursoIds,
      },
    },
  });
}

export async function countByCurso(idCurso: number): Promise<number> {
  return prisma.alumno.count({
    where: {
      idCurso,
    },
  });
}
export async function findByDocente(keycloakId: string, filtros: AlumnoDocenteFiltrosDTO) {
  const whereResumen: Prisma.AlumnoWhereInput = {
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

  if (filtros.cursoId) {
    whereResumen.idCurso = filtros.cursoId;
  }

  if (filtros.empresaId) {
    whereResumen.idEmpresa = filtros.empresaId;
  }

  const whereListado: Prisma.AlumnoWhereInput = {
    ...whereResumen,
  };

  if (filtros.search) {
    whereListado.usuario = {
      OR: [
        {
          nombre: {
            contains: filtros.search,
            mode: 'insensitive',
          },
        },
        {
          apellido: {
            contains: filtros.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: filtros.search,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  const [totalAlumnos, totalItems, items] = await prisma.$transaction([
    prisma.alumno.count({
      where: whereResumen,
    }),

    prisma.alumno.count({
      where: whereListado,
    }),

    prisma.alumno.findMany({
      where: whereListado,

      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            fotoPerfilUrl: true,
          },
        },

        curso: {
          select: {
            nombreCurso: true,
          },
        },

        empresa: {
          select: {
            nombre: true,
          },
        },
      },

      orderBy: {
        usuario: {
          apellido: 'asc',
        },
      },

      skip: (filtros.page - 1) * filtros.pageSize,

      take: filtros.pageSize,
    }),
  ]);

  return {
    resumen: {
      total: totalAlumnos,
      activos: null,
      enRiesgo: null,
      tareasPendientes: null,
      promedioGeneral: null,
    },

    totalItems,

    items,
  };
}
