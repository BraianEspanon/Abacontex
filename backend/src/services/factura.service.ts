import { AuthUser } from '../types/express';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as ventaRepository from '../repositories/venta.repository';
import * as facturaRepository from '../repositories/factura.repository';

import { ObtenerVentasPendientesDTO, GenerarFacturaDTO } from '../validators/factura.validator';
import { FacturaMapper } from '../dto/factura/factura.mapper';

import { ConflictError } from '../errors/conflict.error';
import { BadRequestError } from '../errors/bad-request-error';

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

export async function generarFactura(user: AuthUser, data: GenerarFacturaDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;

  // 1. Verificar Venta
  const venta = await ventaRepository.findByIdAndEmpresaOrThrow(data.ventaId, empresa.id);

  if (venta.estado !== 'CONFIRMADA') {
    throw new BadRequestError('Solo se pueden facturar ventas confirmadas.');
  }

  // 2. Verificar que no exista factura previa
  const facturaExistente = await facturaRepository.findByVentaId(data.ventaId);

  if (facturaExistente) {
    throw new ConflictError('Esta venta ya tiene una factura generada.');
  }

  // 3. Regla de negocio CA04: Consistencia de tipo de cliente y factura
  if (data.condicionFiscal === 'RESPONSABLE_INSCRIPTO' && data.tipoFactura !== 'A') {
    throw new BadRequestError(
      'Inconsistencia: Un cliente Responsable Inscripto requiere una Factura A.',
      data
    );
  }

  if (data.condicionFiscal === 'CONSUMIDOR_FINAL' && data.tipoFactura !== 'B') {
    throw new BadRequestError(
      'Inconsistencia: Un cliente Consumidor Final requiere una Factura B.',
      data
    );
  }

  // 4. Crear factura
  const nuevaFactura = await facturaRepository.create(data);

  return nuevaFactura;
}
