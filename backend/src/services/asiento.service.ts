// Este service implementa un patrón Strategy
// ya que según el tipo de Acción pendiente de asiento, se hace una actividad u otra

import { AuthUser } from '../types/express';
import { TIPOS_MOVIMIENTO_ASIENTO } from '../constants/asiento.constants';

import { PaginatedResponse } from '../dto/paginated-response.dto';
import {
  OperacionPendienteItemDTO,
  DetallePendienteResponseDTO,
} from '../dto/contabilidad/asiento.dto';

import { ObtenerPendientesDTO, ObtenerDetallePendienteDTO } from '../validators/asiento.validator';

import * as usuarioService from './usuario.service';

import * as usuarioRepository from '../repositories/usuario.repository';

import {
  getAllAsientoStrategies,
  getAsientoStrategy,
} from './asiento-strategies/asiento-strategy.registry';
import { OperacionPendienteContext } from './asiento-strategies/asiento-strategy.interface';

export async function obtenerTiposMovimiento(user: AuthUser) {
  await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  return TIPOS_MOVIMIENTO_ASIENTO;
}

export async function obtenerPendientes(
  user: AuthUser,
  filtros: ObtenerPendientesDTO
): Promise<PaginatedResponse<OperacionPendienteItemDTO>> {
  const usuarioConEmpresa = await usuarioService.getAlumnoConEmpresaOrThrow(user);

  const ctx: OperacionPendienteContext = {
    empresaId: usuarioConEmpresa.alumno.empresa.id,
    esSextoAño: usuarioConEmpresa.alumno.empresa.curso.año === 6,
  };

  const estrategias = getAllAsientoStrategies();
  const listados = await Promise.all(estrategias.map((e) => e.getPendientes(ctx)));

  const todosPendientes = listados.flat();
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

export async function obtenerDetallePendiente(
  user: AuthUser,
  params: ObtenerDetallePendienteDTO
): Promise<DetallePendienteResponseDTO> {
  const usuarioConEmpresa = await usuarioService.getAlumnoConEmpresaOrThrow(user);

  const ctx: OperacionPendienteContext = {
    empresaId: usuarioConEmpresa.alumno.empresa.id,
    esSextoAño: usuarioConEmpresa.alumno.empresa.curso.año === 6,
  };

  const estrategia = getAsientoStrategy(params.tipo);

  return estrategia.getDetalle(params.id, ctx);
}
