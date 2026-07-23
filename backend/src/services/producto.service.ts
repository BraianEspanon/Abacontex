import { AuthUser } from '../types/express';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as productoRepository from '../repositories/producto.repository';

import { CrearProductoDTO } from '../validators/producto.validator';

import { ConflictError } from '../errors/conflict.error';

export async function crearProducto(user: AuthUser, data: CrearProductoDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('Debes completar tu registro antes de registrar un producto.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  const empresa = usuario.alumno.empresa;

  const productoExistente = await productoRepository.findByNombre(empresa.id, data.nombre);

  if (productoExistente) {
    throw new ConflictError('Ya existe un producto con ese nombre.', {
      nombre: data.nombre,
    });
  }

  return productoRepository.create(empresa.id, data);
}
