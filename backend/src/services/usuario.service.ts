import { prisma } from '../lib/prisma';
import { AuthUser } from '../types/express';
import { getRolSistema } from './role.service';
import * as keycloakAdminService from './keycloak-admin.service';
import { RolSistema, ROLES } from '../constants/roles';

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
      cursos: {
        include: {
          curso: true,
        },
      },
    },
  });
};

export async function crearUsuario(data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: RolSistema;
}) {
  let keycloakId: string | undefined;

  try {
    keycloakId = await keycloakAdminService.createUser({
      username: data.email,
      email: data.email,
      firstName: data.nombre,
      lastName: data.apellido,
      password: data.password,
    });

    if (data.rol === ROLES.DOCENTE || data.rol === ROLES.ADMIN) {
      await keycloakAdminService.removeUserFromGroup(keycloakId, 'Grupo_Alumnos');

      await keycloakAdminService.assignRealmRole(keycloakId, data.rol);
    }

    const rolSistema = await prisma.rolesSistema.findUnique({
      where: {
        nombreRol: data.rol,
      },
    });

    if (!rolSistema) {
      throw new Error(`No existe el rol ${data.rol} en la BD`);
    }

    const usuario = await prisma.usuario.create({
      data: {
        keycloakId,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rolSistemaId: rolSistema.idRol,
      },
    });

    console.info(`[USUARIO] Creado ${usuario.email} con rol ${data.rol}`);

    return usuario;
  } catch (error) {
    if (keycloakId) {
      try {
        await keycloakAdminService.deleteUser(keycloakId);

        console.warn(`[ROLLBACK] Usuario ${keycloakId} eliminado de Keycloak`);
      } catch (rollbackError) {
        console.error('[ROLLBACK] Error eliminando usuario', rollbackError);
      }
    }

    throw error;
  }
}
