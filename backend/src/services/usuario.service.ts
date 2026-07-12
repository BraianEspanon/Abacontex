import { prisma } from '../lib/prisma';
import { AuthUser } from '../types/express';
import { getRolSistema } from './role.service';
import * as keycloakAdminService from './keycloak-admin.service';

export const syncUsuario = async (user: AuthUser) => {
  let usuario = await prisma.usuario.findUnique({
    where: {
      keycloakId: user.keycloakId,
    },
  });

  if (usuario) {
    return usuario;
  }

  const rolSistema = await getRolSistema(user.roles);

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

export const getUsuarioActual = async (user: AuthUser) => {
  return prisma.usuario.findUnique({
    where: {
      keycloakId: user.keycloakId,
    },
    include: {
      rolSistema: true,
    },
  });
};

export async function actualizarUsuarioActual(
  user: AuthUser,
  data: {
    nombre: string;
    apellido: string;
  }
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      keycloakId: user.keycloakId,
    },
  });

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  await keycloakAdminService.updateUser(user.keycloakId, {
    firstName: data.nombre,
    lastName: data.apellido,
  });

  await prisma.usuario.update({
    where: {
      keycloakId: user.keycloakId,
    },
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
    },
  });

  return getUsuarioActual(user);
}

export async function actualizarPassword(
  user: AuthUser,
  data: {
    currentPassword: string;
    newPassword: string;
  }
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      keycloakId: user.keycloakId,
    },
  });

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  await keycloakAdminService.verifyPassword(usuario.email, data.currentPassword);

  await keycloakAdminService.updatePassword(user.keycloakId, data.newPassword);
}
