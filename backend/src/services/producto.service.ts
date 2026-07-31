import { AuthUser } from '../types/express';

import * as storageService from '../integrations/storage/storage.service';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as productoRepository from '../repositories/producto.repository';

import {
  ActualizarProductoDTO,
  CrearProductoDTO,
  ObtenerProductosDTO,
} from '../validators/producto.validator';

import { STORAGE_FOLDERS } from '../constants/storage-folders';

import { ConflictError } from '../errors/conflict.error';

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

  return productoRepository.create(empresa.id, data, fotoUrl, fotoPublicId);
}

export async function actualizarProducto(
  user: AuthUser,
  idProducto: number,
  data: ActualizarProductoDTO
) {
  const empresa = await obtenerEmpresaUsuario(user);

  const producto = await productoRepository.findByIdAndEmpresaOrThrow(idProducto, empresa.id);

  if (producto.nombre !== data.nombre) {
    const productoExistente = await productoRepository.findByNombre(empresa.id, data.nombre);

    if (productoExistente) {
      throw new ConflictError('Ya existe un producto con ese nombre.', {
        nombre: data.nombre,
      });
    }
  }

  return productoRepository.update(idProducto, data);
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
      fotoUrl: producto.fotoUrl,
      precioUnitario: Number(producto.precioUnitario),
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

  await productoRepository.findByIdAndEmpresaOrThrow(idProducto, empresa.id);

  await productoRepository.remove(idProducto);
}
