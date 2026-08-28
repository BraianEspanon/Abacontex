import { NotFoundError } from '../errors/not-found.error';
import { prisma, getDbClient } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export async function crearDocente(
  usuarioKeycloakId: string,
  email: string,
  nombre: string,
  apellido: string,
  rolSistemaId: number,
  cursoIds: number[],
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const usuario = await db.usuario.create({
    data: {
      keycloakId: usuarioKeycloakId,
      email: email,
      nombre: nombre,
      apellido: apellido,
      rolSistemaId: rolSistemaId,
    },
  });

  await db.profesorCursos.createMany({
    data: cursoIds.map((idCurso) => ({
      idCurso,
      idUsuario: usuario.id,
    })),
  });

  return usuario;
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

export type DocenteActualEntity = NonNullable<Awaited<ReturnType<typeof findByKeycloakId>>>;

export async function findByKeycloakIdOrThrow(keycloakId: string) {
  const docente = await findByKeycloakId(keycloakId);

  if (!docente) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return docente;
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

export async function updateCursosProfesor(
  idUsuario: string,
  cursoIds: number[],
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  await db.profesorCursos.deleteMany({
    where: {
      idUsuario,
    },
  });

  await db.profesorCursos.createMany({
    data: cursoIds.map((idCurso) => ({
      idCurso,
      idUsuario,
    })),
  });
}
