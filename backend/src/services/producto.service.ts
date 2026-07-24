import { AuthUser } from '../types/express';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as productoRepository from '../repositories/producto.repository';

import { ActualizarProductoDTO, CrearProductoDTO } from '../validators/producto.validator';

import { ConflictError } from '../errors/conflict.error';

async function obtenerEmpresaActual(user: AuthUser) {
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

export async function crearProducto(user: AuthUser, data: CrearProductoDTO) {
  const empresa = await obtenerEmpresaActual(user);

  const productoExistente = await productoRepository.findByNombre(empresa.id, data.nombre);

  if (productoExistente) {
    throw new ConflictError('Ya existe un producto con ese nombre.', {
      nombre: data.nombre,
    });
  }

  return productoRepository.create(empresa.id, data);
}

export async function actualizarProducto(
  user: AuthUser,
  idProducto: number,
  data: ActualizarProductoDTO
) {
  const empresa = await obtenerEmpresaActual(user);

  const producto = await productoRepository.findByIdOrThrow(idProducto);

  if (producto.empresaId !== empresa.id) {
    throw new ConflictError('El producto no pertenece a tu empresa.');
  }

  if (producto.nombre !== data.nombre) {
    const productoExistente = await productoRepository.findByNombre(empresa.id, data.nombre);

    if (productoExistente) {
      throw new ConflictError('Ya existe un producto con ese nombre.', {
        nombre: data.nombre,
      });
    }
  }

  await productoRepository.update(idProducto, data);

  return productoRepository.findByIdOrThrow(idProducto);
}

export async function getProducto(user: AuthUser, idProducto: number) {
  const empresa = await obtenerEmpresaActual(user);

  const producto = await productoRepository.findByIdOrThrow(idProducto);

  if (producto.empresaId !== empresa.id) {
    throw new ConflictError('El producto no pertenece a tu empresa.');
  }

  return producto;
}
