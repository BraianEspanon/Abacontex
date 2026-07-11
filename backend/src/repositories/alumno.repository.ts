import { prisma } from '../lib/prisma';

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
