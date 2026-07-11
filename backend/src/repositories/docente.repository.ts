import { prisma } from '../lib/prisma';

export async function crearDocente(
  usuarioKeycloakId: string,
  email: string,
  nombre: string,
  apellido: string,
  rolSistemaId: number,
  cursoIds: number[]
) {
  return prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.create({
      data: {
        keycloakId: usuarioKeycloakId,
        email: email,
        nombre: nombre,
        apellido: apellido,
        rolSistemaId: rolSistemaId,
      },
    });

    await tx.profesorCursos.createMany({
      data: cursoIds.map((idCurso) => ({
        idCurso,
        idUsuario: usuario.id,
      })),
    });

    return usuario;
  });
}

export async function findByKeycloakId(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,

      profesorCursos: {
        select: {
          curso: {
            select: {
              idCurso: true,
              nombreCurso: true,
            },
          },
        },
      },
    },
  });
}

export async function findCursoIdsByKeycloakId(keycloakId: string): Promise<number[]> {
  const profesorCursos = await prisma.profesorCursos.findMany({
    where: {
      profesor: {
        keycloakId,
      },
    },
    select: {
      idCurso: true,
    },
  });

  return profesorCursos.map((pc) => pc.idCurso);
}

export async function findCursosByDocente(keycloakId: string) {
  return prisma.curso.findMany({
    where: {
      profesores: {
        some: {
          profesor: {
            keycloakId,
          },
        },
      },
    },

    orderBy: {
      nombreCurso: 'asc',
    },
  });
}
