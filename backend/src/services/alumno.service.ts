import { prisma } from '../lib/prisma';
import { AuthUser } from '../types/express';
import * as keycloakAdminService from './keycloak-admin.service';

export async function getAlumnoActual(user: AuthUser) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      keycloakId: user.keycloakId,
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

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  if (!usuario.alumno) {
    return {
      registroCompleto: false,
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      curso: null,
      rolEmpresa: null,
      empresa: null,
    };
  }

  return {
    registroCompleto: true,
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,

    curso: {
      id: usuario.alumno.curso.idCurso,
      nombre: usuario.alumno.curso.nombreCurso,
    },

    rolEmpresa: usuario.alumno.rolEmpresa
      ? {
          id: usuario.alumno.rolEmpresa.idRol,
          nombre: usuario.alumno.rolEmpresa.nombreRol,
          descripcion: usuario.alumno.rolEmpresa.descripcion,
        }
      : null,

    empresa: usuario.alumno.empresa
      ? {
          id: usuario.alumno.empresa.id,
          nombre: usuario.alumno.empresa.nombre,
        }
      : null,
  };
}

export async function completarRegistro(
  user: AuthUser,
  data: {
    idCurso: number;
    idRolEmpresa: number;
  }
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      keycloakId: user.keycloakId,
    },
    include: {
      alumno: true,
    },
  });

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  if (usuario.alumno) {
    throw new Error('El registro ya fue completado');
  }

  const curso = await prisma.curso.findUnique({
    where: {
      idCurso: data.idCurso,
    },
  });

  if (!curso) {
    throw new Error('Curso inexistente');
  }

  const rolEmpresa = await prisma.rolesEmpresa.findUnique({
    where: {
      idRol: data.idRolEmpresa,
    },
  });

  if (!rolEmpresa) {
    throw new Error('Rol de empresa inexistente');
  }

  await prisma.alumno.create({
    data: {
      id: usuario.id,
      idCurso: data.idCurso,
      idRolEmpresa: data.idRolEmpresa,
    },
    include: {
      curso: true,
      rolEmpresa: true,
    },
  });
  return getAlumnoActual(user);
}

export async function actualizarPerfil(
  user: AuthUser,
  data: {
    nombre: string;
    apellido: string;
    idRolEmpresa: number;
  }
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      keycloakId: user.keycloakId,
    },
    include: {
      alumno: true,
    },
  });

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  if (!usuario.alumno) {
    throw new Error('El alumno no completó el registro');
  }

  const rolEmpresa = await prisma.rolesEmpresa.findUnique({
    where: {
      idRol: data.idRolEmpresa,
    },
  });

  if (!rolEmpresa) {
    throw new Error('Rol de empresa inexistente');
  }

  await keycloakAdminService.updateUser(user.keycloakId, {
    firstName: data.nombre,
    lastName: data.apellido,
  });

  await prisma.$transaction([
    prisma.usuario.update({
      where: {
        keycloakId: user.keycloakId,
      },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
      },
    }),

    prisma.alumno.update({
      where: {
        id: usuario.alumno.id,
      },
      data: {
        idRolEmpresa: data.idRolEmpresa,
      },
    }),
  ]);

  return getAlumnoActual(user);
}
