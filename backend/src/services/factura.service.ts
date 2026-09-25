import { AuthUser } from '../types/express';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '../constants/audit.constants';

import * as auditLogService from './audit-log.service';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as ventaRepository from '../repositories/venta.repository';
import * as facturaRepository from '../repositories/factura.repository';
import * as transactionRepository from '../repositories/transaction.repository';

import {
  ObtenerVentasPendientesDTO,
  GenerarFacturaDTO,
  ObtenerFacturasDTO,
} from '../validators/factura.validator';
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

  // 4. Calcular campos obligatorios de factura
  const currentYear = new Date().getFullYear();
  const fechaVencimiento = new Date(currentYear, 11, 31, 23, 59, 59, 999);
  const cai = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
  const localidad = 'Formosa';

  // 5. Crear factura
  const factura = await transactionRepository.ejecutarTransaccion(async (tx) => {
    const nuevaFactura = await facturaRepository.create(
      {
        ...data,
        cai,
        fechaVencimiento,
        localidad,
      },
      tx
    );

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.FACTURA,
      entityId: nuevaFactura.idFactura,
      empresaId: empresa.id,
      newValues: {
        idFactura: nuevaFactura.idFactura,
        ventaId: data.ventaId,
        tipoFactura: data.tipoFactura,
        condicionFiscal: data.condicionFiscal,
        cai,
      },
      description: `Se generó la factura #${nuevaFactura.idFactura} tipo ${data.tipoFactura} para la venta #${data.ventaId}`,
    });

    return nuevaFactura;
  });

  return obtenerDetalleFactura(user, factura.idFactura);
}

export async function obtenerDetalleFactura(user: AuthUser, idFactura: number) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno?.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;

  const factura = await facturaRepository.findByIdAndEmpresaFullOrThrow(idFactura, empresa.id);

  return FacturaMapper.toFacturaDetalleDTO(factura);
}

export async function obtenerFacturas(user: AuthUser, filtros: ObtenerFacturasDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;

  const ahora = new Date();
  const fechaInicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const fechaFinMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);

  const [resumen, paginacion] = await Promise.all([
    facturaRepository.obtenerResumenFacturas(empresa.id, fechaInicioMes, fechaFinMes),
    facturaRepository.findFacturasByEmpresa(empresa.id, filtros),
  ]);

  const totalPages = Math.ceil(paginacion.total / filtros.pageSize);

  return {
    resumen,
    items: paginacion.items.map(FacturaMapper.toFacturaListDTO),
    page: filtros.page,
    pageSize: filtros.pageSize,
    totalItems: paginacion.total,
    totalPages,
  };
}
