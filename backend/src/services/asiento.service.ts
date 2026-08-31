import { AuthUser } from '../types/express';
import { TIPOS_MOVIMIENTO_ASIENTO } from '../constants/asiento.constants';

import { PaginatedResponse } from '../dto/paginated-response.dto';
import { OperacionPendienteItemDTO } from '../dto/contabilidad/asiento.dto';
import { AsientoMapper } from '../dto/contabilidad/asiento.mapper';

import { ObtenerPendientesDTO } from '../validators/asiento.validator';

import * as usuarioService from './usuario.service';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as asientoRepository from '../repositories/asiento.repository';

export async function obtenerTiposMovimiento(user: AuthUser) {
  await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  return TIPOS_MOVIMIENTO_ASIENTO;
}

export async function obtenerPendientes(
  user: AuthUser,
  filtros: ObtenerPendientesDTO
): Promise<PaginatedResponse<OperacionPendienteItemDTO>> {
  const usuarioConEmpresa = await usuarioService.getAlumnoConEmpresaOrThrow(user);
  const empresaId = usuarioConEmpresa.alumno.empresa.id;

  const [ventas, movimientos, conciliaciones] = await Promise.all([
    asientoRepository.findVentasPendientes(empresaId),
    asientoRepository.findMovimientosPendientes(empresaId),
    asientoRepository.findConciliacionesPendientes(empresaId),
  ]);

  const todosPendientes: OperacionPendienteItemDTO[] = [
    ...ventas.map(AsientoMapper.ventaToPendienteDTO),
    ...movimientos.map(AsientoMapper.movimientoToPendienteDTO),
    ...conciliaciones.map(AsientoMapper.conciliacionToPendienteDTO),
  ];

  // Ordenar cronológicamente ascendente (las más antiguas primero)
  todosPendientes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  // Paginación en memoria del listado consolidado
  const totalItems = todosPendientes.length;
  const totalPages = Math.ceil(totalItems / filtros.pageSize) || 1;
  const startIndex = (filtros.page - 1) * filtros.pageSize;
  const paginatedItems = todosPendientes.slice(startIndex, startIndex + filtros.pageSize);

  return {
    items: paginatedItems,
    page: filtros.page,
    pageSize: filtros.pageSize,
    totalItems,
    totalPages,
  };
}
