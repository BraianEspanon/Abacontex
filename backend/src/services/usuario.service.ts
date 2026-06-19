import { prisma } from '../lib/prisma';
import { AuthUser } from '../types/express';
import { getRolSistema } from './role.service';

export const syncUsuario = async (
  user: AuthUser
) => {
  let usuario =
    await prisma.usuario.findUnique({
      where: {
        keycloakId: user.keycloakId,
      },
    });

  if (usuario) {
    return usuario;
  }

  const rolSistema =
    await getRolSistema(user.roles);

  usuario = await prisma.usuario.create({
    data: {
      keycloakId: user.keycloakId,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rolSistemaId: rolSistema.idRol,
    },
  });

  return usuario;
};


export const getUsuarioActual = async (
  user: AuthUser
) => {
  return prisma.usuario.findUnique({
    where: {
      keycloakId: user.keycloakId,
    },
    include: {
      rolSistema: true,
      cursos: {
        include: {
          curso: true,
        },
      },
    },
  });
};