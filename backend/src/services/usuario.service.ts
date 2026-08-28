import { AuthUser } from '../types/express';
import { getRolSistema } from './role.service';
import { UploadedFile } from '../integrations/storage/storage.types';
import { STORAGE_FOLDERS } from '../constants/storage-folders';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '../constants/audit.constants';

import * as auditLogService from './audit-log.service';

import * as keycloakAdminService from '../integrations/keycloak/keycloak-admin.service';
import * as usuarioRepository from '../repositories/usuario.repository';
import * as storageService from '../integrations/storage/storage.service';
import * as transactionRepository from '../repositories/transaction.repository';

import { ActualizarContraseñaDTO, ActualizarUsuarioDTO } from '../validators/usuario.validator';

import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict.error';
import { ForbiddenError } from '../errors/forbidden.error';

export async function syncUsuario(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakId(user.keycloakId);

  if (usuario) {
    return usuario;
  }

  const rolSistema = await getRolSistema(user.roles);

  return transactionRepository.ejecutarTransaccion(async (tx) => {
    const nuevoUsuario = await usuarioRepository.create(user, rolSistema.idRol, tx);

    await auditLogService.registrarAccion({
      tx,
      usuarioId: nuevoUsuario.id,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.USUARIO,
      entityId: nuevoUsuario.id,
      newValues: nuevoUsuario,
      description: 'Sincronización inicial del usuario desde Keycloak',
    });

    return nuevoUsuario;
  });
}

export async function getUsuarioActual(user: AuthUser) {
  return usuarioRepository.findByKeycloakIdWithRolSistemaOrThrowForResponse(user.keycloakId);
}

export async function actualizarUsuarioActual(
  user: AuthUser,
  data: ActualizarUsuarioDTO,
  foto?: Express.Multer.File
) {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  if (foto && data.eliminarFoto) {
    throw new BadRequestError('No puedes reemplazar y eliminar la foto al mismo tiempo.');
  }

  let fotoPerfilUrl = usuario.fotoPerfilUrl;
  let fotoPerfilPublicId = usuario.fotoPerfilPublicId;

  let uploaded: UploadedFile | undefined;

  try {
    if (foto) {
      uploaded = await storageService.upload(foto, STORAGE_FOLDERS.USUARIOS);

      fotoPerfilUrl = uploaded.url;
      fotoPerfilPublicId = uploaded.publicId;
    }

    if (data.eliminarFoto) {
      fotoPerfilUrl = null;
      fotoPerfilPublicId = null;
    }

    await keycloakAdminService.updateUser(user.keycloakId, {
      firstName: data.nombre,
      lastName: data.apellido,
    });

    await transactionRepository.ejecutarTransaccion(async (tx) => {
      const usuarioActualizado = await usuarioRepository.update(
        user.keycloakId,
        {
          ...data,
          fotoPerfilUrl,
          fotoPerfilPublicId,
        },
        tx
      );

      await auditLogService.registrarAccion({
        tx,
        usuarioId: usuario.id,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.USUARIO,
        entityId: usuario.id,
        oldValues: usuario,
        newValues: usuarioActualizado,
        description: 'Actualización de datos del perfil',
      });
    });

    if (foto && usuario.fotoPerfilPublicId) {
      await storageService.deleteFile(usuario.fotoPerfilPublicId);
    }

    if (data.eliminarFoto && usuario.fotoPerfilPublicId) {
      await storageService.deleteFile(usuario.fotoPerfilPublicId);
    }

    return getUsuarioActual(user);
  } catch (error) {
    if (uploaded) {
      await storageService.deleteFile(uploaded.publicId);
    }

    throw error;
  }
}

export async function actualizarPassword(user: AuthUser, data: ActualizarContraseñaDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  await keycloakAdminService.verifyPassword(usuario.email, data.currentPassword);

  await keycloakAdminService.updatePassword(user.keycloakId, data.newPassword);

  await transactionRepository.ejecutarTransaccion(async (tx) => {
    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.UPDATE_PASSWORD,
      entity: AUDIT_ENTITIES.USUARIO,
      entityId: usuario.id,
      description: 'Actualización de contraseña del usuario',
    });
  });
}

export async function getAlumnoSextoConEmpresaOrThrow(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError(
      'Debes completar tu registro antes de realizar operaciones sobre productos.'
    );
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  if (usuario.alumno.empresa.curso.año !== 6) {
    throw new ForbiddenError('Solo los alumnos de 6° año pueden acceder a este módulo.');
  }

  return {
    ...usuario,
    alumno: {
      ...usuario.alumno,
      empresa: usuario.alumno.empresa,
    },
  };
}

export async function getAlumnoConEmpresaOrThrow(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  return {
    ...usuario,
    alumno: {
      ...usuario.alumno,
      empresa: usuario.alumno.empresa,
    },
  };
}
