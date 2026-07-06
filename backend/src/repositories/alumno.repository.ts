import { prisma } from '../lib/prisma';

export async function findCandidatos(idCurso: number, idUsuario: string, search?: string) {
  return prisma.alumno.findMany({
    where: {
      idCurso,

      idEmpresa: null,

      NOT: {
        id: idUsuario,
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
