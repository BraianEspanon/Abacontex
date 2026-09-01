// Este service implementa un patrón Strategy
// ya que según el tipo de Acción pendiente de asiento, se hace una actividad u otra

import { AuthUser } from '../types/express';
import { TIPOS_MOVIMIENTO_ASIENTO } from '../constants/asiento.constants';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '../constants/audit.constants';

import { PaginatedResponse } from '../dto/paginated-response.dto';
import {
  OperacionPendienteItemDTO,
  DetallePendienteResponseDTO,
} from '../dto/contabilidad/asiento.dto';

import {
  ObtenerPendientesDTO,
  ObtenerDetallePendienteDTO,
  CrearAsientoDTO,
} from '../validators/asiento.validator';

import * as usuarioService from './usuario.service';
import * as auditLogService from './audit-log.service';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as asientoRepository from '../repositories/asiento.repository';
import * as cuentaRepository from '../repositories/cuenta.repository';
import * as transactionRepository from '../repositories/transaction.repository';

import {
  getAllAsientoStrategies,
  getAsientoStrategy,
} from './asiento-strategies/asiento-strategy.registry';
import { OperacionPendienteContext } from './asiento-strategies/asiento-strategy.interface';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found.error';

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

export async function crearAsientoContable(user: AuthUser, data: CrearAsientoDTO) {
  const usuarioConEmpresa = await usuarioService.getAlumnoConEmpresaOrThrow(user);
  const empresaId = usuarioConEmpresa.alumno.empresa.id;
  const alumnoId = usuarioConEmpresa.alumno.id;

  // 1. Validar Partida Doble
  const totalDebe = data.detalles.reduce((acc, d) => acc + d.debe, 0);
  const totalHaber = data.detalles.reduce((acc, d) => acc + d.haber, 0);

  if (Math.abs(totalDebe - totalHaber) > 0.001) {
    throw new BadRequestError(
      `El asiento está desbalanceado. Total Debe (${totalDebe.toFixed(
        2
      )}) debe ser igual a Total Haber (${totalHaber.toFixed(2)}).`
    );
  }

  // 2. Validar que cada renglón tenga importe exclusivamente en Debe o en Haber
  for (const d of data.detalles) {
    if (d.debe === 0 && d.haber === 0) {
      throw new BadRequestError(
        'Cada renglón contable debe contener un importe mayor a cero en el Debe o en el Haber.'
      );
    }
    if (d.debe > 0 && d.haber > 0) {
      throw new BadRequestError(
        'Un renglón contable no puede tener importe simultáneamente en el Debe y en el Haber.'
      );
    }
  }

  return transactionRepository.ejecutarTransaccion(async (tx) => {
    const ctx: OperacionPendienteContext = {
      empresaId,
      esSextoAño: usuarioConEmpresa.alumno.empresa.curso.año === 6,
    };

    if (!data.operacionId) {
      throw new BadRequestError(
        `El ID de operación es obligatorio para asientos de origen ${data.tipo}.`
      );
    }

    const estrategia = getAsientoStrategy(data.tipo);
    const resultadoValidacion = await estrategia.validarYObtenerFecha(data.operacionId, ctx, tx);

    const fechaAsiento = resultadoValidacion.fecha;
    const ventaId = resultadoValidacion.ventaId;
    const movimientoFinancieroId = resultadoValidacion.movimientoFinancieroId;
    const conciliacionId = resultadoValidacion.conciliacionId;

    // 3. Validar existencia y estado activo de todas las cuentas contables ingresadas
    const cuentaIdsUnicos = Array.from(new Set(data.detalles.map((d) => d.cuentaId)));
    const cuentasExistentes = await cuentaRepository.findManyByIds(cuentaIdsUnicos, tx);

    if (cuentasExistentes.length !== cuentaIdsUnicos.length) {
      const idsEncontrados = new Set(cuentasExistentes.map((c) => c.idCuenta));
      const idsFaltantes = cuentaIdsUnicos.filter((id) => !idsEncontrados.has(id));

      throw new NotFoundError(
        `Una o más cuentas contables no existen o no están activas (${idsFaltantes.join(', ')}).`
      );
    }

    const ultimoNumeroAsiento = await asientoRepository.findUltimoNumeroAsientoByEmpresa(
      empresaId,
      tx
    );
    const numeroAsiento = ultimoNumeroAsiento + 1;

    let ultimoNumeroFolio = await asientoRepository.findUltimoNumeroFolioByEmpresa(empresaId, tx);

    for (const d of data.detalles) {
      const folioExistente = await asientoRepository.findFolioCuentaEmpresa(
        empresaId,
        d.cuentaId,
        tx
      );

      if (!folioExistente) {
        ultimoNumeroFolio += 1;
        await asientoRepository.createFolioCuentaEmpresa(
          {
            empresaId,
            cuentaId: d.cuentaId,
            numeroFolio: ultimoNumeroFolio,
          },
          tx
        );
      }
    }

    const asientoCreado = await asientoRepository.createAsientoContable(
      {
        empresaId,
        alumnoId,
        numeroAsiento,
        fecha: fechaAsiento,
        conceptoGeneral: data.conceptoGeneral,
        origen: data.tipo,
        ventaId: ventaId ?? null,
        movimientoFinancieroId: movimientoFinancieroId ?? null,
        conciliacionId: conciliacionId ?? null,
        detalles: data.detalles.map((d, index) => ({
          cuentaId: d.cuentaId,
          orden: index + 1,
          movimiento: d.movimiento,
          debe: d.debe,
          haber: d.haber,
        })),
      },
      tx
    );

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuarioConEmpresa.id,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.ASIENTO_CONTABLE,
      entityId: asientoCreado.idAsiento,
      empresaId,
      alumnoId,
      newValues: {
        idAsiento: asientoCreado.idAsiento,
        numeroAsiento: asientoCreado.numeroAsiento,
        origen: data.tipo,
        conceptoGeneral: data.conceptoGeneral,
      },
      description: `Registró el asiento contable N° ${asientoCreado.numeroAsiento} (${data.tipo}) en el Libro Diario.`,
    });

    return asientoCreado;
  });
}
