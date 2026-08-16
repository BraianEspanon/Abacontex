import { AuthUser } from '../types/express';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as ventaRepository from '../repositories/venta.repository';

import { ObtenerVentasPendientesDTO } from '../validators/factura.validator';
import { FacturaMapper } from '../dto/factura/factura.mapper';

import { ConflictError } from '../errors/conflict.error';

export async function obtenerVentasPendientesFacturacion(
  user: AuthUser,
  filtros: ObtenerVentasPendientesDTO
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;

  const { total, items } = await ventaRepository.findVentasPendientesFacturacion(
    empresa.id,
    filtros
  );

  const totalPages = Math.ceil(total / filtros.pageSize);

  return {
    items: items.map(FacturaMapper.toVentaPendienteDTO),
    page: filtros.page,
    pageSize: filtros.pageSize,
    totalItems: total,
    totalPages,
  };
}
