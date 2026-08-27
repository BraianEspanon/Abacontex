import { AuthUser } from '../types/express';
import { IVA } from '../constants/iva';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '../constants/audit.constants';

import * as auditLogService from './audit-log.service';
import * as storageService from '../integrations/storage/storage.service';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as productoRepository from '../repositories/producto.repository';
import * as produccionRepository from '../repositories/produccion.repository';
import * as pedidoRepository from '../repositories/pedido.repository';
import * as transactionRepository from '../repositories/transaction.repository';

import {
  ActualizarProductoDTO,
  CrearProductoDTO,
  ObtenerProductosDTO,
} from '../validators/producto.validator';

import { STORAGE_FOLDERS } from '../constants/storage-folders';

import { ConflictError } from '../errors/conflict.error';
import { BadRequestError } from '../errors/bad-request-error';
import { UploadedFile } from '../integrations/storage/storage.types';

async function obtenerEmpresaUsuario(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError(
      'Debes completar tu registro antes de realizar operaciones sobre productos.'
    );
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  return usuario.alumno.empresa;
}

function calcularPrecios(precioUnitario: number, margenGanancia: number) {
  const precioVenta = precioUnitario * (1 + margenGanancia / 100);
  const precioConsumidorFinal = precioVenta * (1 + IVA);

  return {
    precioVenta,
    precioConsumidorFinal,
  };
}

export async function crearProducto(
  user: AuthUser,
  data: CrearProductoDTO,
  foto?: Express.Multer.File
) {
  const empresa = await obtenerEmpresaUsuario(user);

  const productoExistente = await productoRepository.findByNombre(empresa.id, data.nombre);

  if (productoExistente) {
    throw new ConflictError('Ya existe un producto con ese nombre.', {
      nombre: data.nombre,
    });
  }

  let fotoUrl: string | null = null;
  let fotoPublicId: string | null = null;

  if (foto) {
    const uploaded = await storageService.upload(foto, STORAGE_FOLDERS.PRODUCTOS);

    fotoUrl = uploaded.url;
    fotoPublicId = uploaded.publicId;
  }

  const { precioVenta, precioConsumidorFinal } = calcularPrecios(
    data.precioUnitario,
    data.margenGanancia
  );

  return transactionRepository.ejecutarTransaccion(async (tx) => {
    const productoCreado = await productoRepository.create(
      empresa.id,
      data,
      fotoUrl,
      fotoPublicId,
      precioVenta,
      precioConsumidorFinal,
      tx
    );

    await auditLogService.registrarAccion({
      tx,
      user,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.PRODUCTO,
      entityId: productoCreado.id,
      empresaId: productoCreado.empresaId,
      newValues: productoCreado,
      description: 'Creación de nuevo producto',
    });

    return productoCreado;
  });
}

export async function actualizarProducto(
  user: AuthUser,
  idProducto: number,
  data: ActualizarProductoDTO,
  foto?: Express.Multer.File
) {
  const empresa = await obtenerEmpresaUsuario(user);

  const producto = await productoRepository.findByIdAndEmpresaWithStorageOrThrow(
    idProducto,
    empresa.id
  );

  if (producto.nombre !== data.nombre) {
    const productoExistente = await productoRepository.findByNombre(empresa.id, data.nombre);

    if (productoExistente) {
      throw new ConflictError('Ya existe un producto con ese nombre.', {
        nombre: data.nombre,
      });
    }
  }

  if (foto && data.eliminarFoto) {
    throw new BadRequestError('No puedes reemplazar y eliminar la imagen al mismo tiempo.');
  }

  let fotoUrl = producto.fotoUrl;
  let fotoPublicId = producto.fotoPublicId;
  let uploaded: UploadedFile | undefined;

  try {
    // Subir imagen nueva
    if (foto) {
      uploaded = await storageService.upload(foto, STORAGE_FOLDERS.PRODUCTOS);

      fotoUrl = uploaded.url;
      fotoPublicId = uploaded.publicId;
    }

    // Eliminar imagen
    if (data.eliminarFoto) {
      fotoUrl = null;
      fotoPublicId = null;
    }

    const { precioVenta, precioConsumidorFinal } = calcularPrecios(
      data.precioUnitario,
      data.margenGanancia
    );

    const productoActualizado = await transactionRepository.ejecutarTransaccion(async (tx) => {
      const result = await productoRepository.update(
        idProducto,
        data,
        fotoUrl,
        fotoPublicId,
        precioVenta,
        precioConsumidorFinal,
        tx
      );

      await auditLogService.registrarAccion({
        tx,
        user,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.PRODUCTO,
        entityId: result.id,
        empresaId: result.empresaId,
        oldValues: producto,
        newValues: result,
        description: 'Actualización de producto',
      });

      return result;
    });

    // Si reemplazamos, recién ahora borrar la vieja
    if (foto && producto.fotoPublicId) {
      await storageService.deleteFile(producto.fotoPublicId);
    }

    // Si eliminamos, recién ahora borrar la vieja
    if (data.eliminarFoto && producto.fotoPublicId) {
      await storageService.deleteFile(producto.fotoPublicId);
    }

    return productoActualizado;
  } catch (error) {
    // Si subimos una nueva imagen y la BD falló,
    // limpiamos la subida.
    if (uploaded) {
      try {
        await storageService.deleteFile(uploaded.publicId);
      } catch {
        // No ocultamos el error original si falla la limpieza.
      }
    }

    throw error;
  }
}

export async function getProducto(user: AuthUser, idProducto: number) {
  const empresa = await obtenerEmpresaUsuario(user);

  return productoRepository.findByIdAndEmpresaOrThrow(idProducto, empresa.id);
}

export async function obtenerProductos(user: AuthUser, filtros: ObtenerProductosDTO) {
  const empresa = await obtenerEmpresaUsuario(user);

  const { totalItems, resumen, items } = await productoRepository.findByEmpresa(
    empresa.id,
    filtros.search,
    filtros.page,
    filtros.pageSize,
    filtros.estadoStock,
    filtros.orden
  );

  return {
    resumen,

    items: items.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      fotoUrl: producto.fotoUrl,
      precioUnitario: Number(producto.precioUnitario),
      margenGanancia: Number(producto.margenGanancia),
      precioVenta: Number(producto.precioVenta),
      precioConsumidorFinal: Number(producto.precioConsumidorFinal),
      stock: producto.stock,
    })),

    page: filtros.page,
    pageSize: filtros.pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / filtros.pageSize),
  };
}

export async function eliminarProducto(user: AuthUser, idProducto: number) {
  const empresa = await obtenerEmpresaUsuario(user);

  const producto = await productoRepository.findByIdAndEmpresaOrThrow(idProducto, empresa.id);

  const tienePedidosPendientes = await pedidoRepository.hasPedidosPendientesByProducto(idProducto);

  if (tienePedidosPendientes) {
    throw new ConflictError(
      'El producto posee operaciones pendientes que deben finalizarse o cancelarse previamente.'
    );
  }

  const tieneOrdenesPendientes =
    await produccionRepository.hasOrdenesPendientesByProducto(idProducto);

  if (tieneOrdenesPendientes) {
    throw new ConflictError(
      'El producto posee operaciones pendientes que deben finalizarse o cancelarse previamente.'
    );
  }

  await transactionRepository.ejecutarTransaccion(async (tx) => {
    const productoEliminado = await productoRepository.remove(idProducto, tx);

    await auditLogService.registrarAccion({
      tx,
      user,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.PRODUCTO,
      entityId: productoEliminado.id,
      empresaId: productoEliminado.empresaId,
      oldValues: producto,
      newValues: productoEliminado,
      description: 'Eliminación (baja lógica) de producto',
    });
  });
}
