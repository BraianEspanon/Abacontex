import { NotFoundError } from '../errors/not-found.error';
import { prisma } from '../lib/prisma';
import { AuthUser } from '../types/express';
import { ActualizarUsuarioDTO } from '../validators/usuario.validator';

export async function create(user: AuthUser, rolSistemaId: number) {
  return await prisma.usuario.create({
    data: {
      keycloakId: user.keycloakId,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rolSistemaId,
    },
  });
}

export async function findByKeycloakId(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
  });
}

export async function findByKeycloakIdOrThrow(keycloakId: string) {
  const usuario = await findByKeycloakId(keycloakId);

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return usuario;
}

export async function findByKeycloakIdWithRolSistema(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      rolSistema: true,
    },
  });
}

export async function findByKeycloakIdWithRolSistemaOrThrow(keycloakId: string) {
  const usuario = await findByKeycloakIdWithRolSistema(keycloakId);

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return usuario;
}

export async function findByKeycloakIdWithAlumno(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: true,
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

export async function findByKeycloakIdWithRolEmpresa(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: {
        include: {
          rolEmpresa: true,
        },
      },
    },
  });
}

export async function findByKeycloakIdWithRolEmpresaOrThrow(keycloakId: string) {
  const usuario = await findByKeycloakIdWithRolEmpresa(keycloakId);

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return usuario;
}
export async function findByKeycloakIdWithEmpresa(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: {
        include: {
          empresa: true,
        },
      },
    },
  });
}

export async function findByKeycloakIdWithEmpresaOrThrow(keycloakId: string) {
  const usuario = await findByKeycloakIdWithEmpresa(keycloakId);

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return usuario;
}

export async function findByKeycloakIdWithEmpresaFull(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: {
        include: {
          empresa: {
            include: {
              curso: true,
              cicloLectivo: true,
              alumnos: {
                include: {
                  usuario: true,
                  rolEmpresa: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function findByKeycloakIdWithEmpresaFullOrThrow(keycloakId: string) {
  const usuario = await findByKeycloakIdWithEmpresaFull(keycloakId);

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return usuario;
}

export async function findByKeycloakIdWithProfesorCursos(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      profesorCursos: true,
    },
  });
}

export async function findByKeycloakIdWithProfesorCursosOrThrow(keycloakId: string) {
  const usuario = await findByKeycloakIdWithProfesorCursos(keycloakId);

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado en base de datos.', {
      keycloakId,
    });
  }

  return usuario;
}

export async function update(keycloakId: string, data: ActualizarUsuarioDTO) {
  return prisma.usuario.update({
    where: {
      keycloakId,
    },
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
      ...(data.fotoPerfilUrl !== undefined && {
        fotoPerfilUrl: data.fotoPerfilUrl,
      }),
    },
  });
}

export async function findByEmail(email: string) {
  return prisma.usuario.findUnique({
    where: {
      email,
    },
  });
}
