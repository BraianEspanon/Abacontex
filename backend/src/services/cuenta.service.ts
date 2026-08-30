import { AuthUser } from '../types/express';
import {
  RegistrarCuentaDTO,
  EditarCuentaDTO,
  ObtenerCuentasDTO,
} from '../validators/cuenta.validator';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '../constants/audit.constants';

import * as auditLogService from './audit-log.service';

import * as cuentaRepository from '../repositories/cuenta.repository';
import * as usuarioRepository from '../repositories/usuario.repository';
import * as transactionRepository from '../repositories/transaction.repository';

export async function registrarCuenta(user: AuthUser, data: RegistrarCuentaDTO) {
  // 1. Validar usuario autenticado
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Validar que el rubro exista y esté activo
  await cuentaRepository.findRubroByIdOrThrow(data.idRubro);

  // 3. Validar unicidad de código
  await cuentaRepository.ensureCodigoIsUnique(data.codigo);

  // 4. Validar unicidad de nombre (case-insensitive)
  await cuentaRepository.ensureNombreIsUnique(data.nombre);

  // 5. Crear la cuenta contable y registrar auditoría dentro de una transacción atómica
  const nuevaCuenta = await transactionRepository.ejecutarTransaccion(async (tx) => {
    const cuentaCreada = await cuentaRepository.createCuenta(
      {
        codigo: data.codigo,
        nombre: data.nombre,
        idRubro: data.idRubro,
        descripcion: data.descripcion,
      },
      tx
    );

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.CUENTA_CONTABLE,
      entityId: cuentaCreada.idCuenta,
      newValues: {
        idCuenta: cuentaCreada.idCuenta,
        codigo: cuentaCreada.codigo,
        nombre: cuentaCreada.nombre,
        rubro: cuentaCreada.rubro.nombre,
        tipoCuenta: cuentaCreada.rubro.tipoCuenta.nombre,
        descripcion: cuentaCreada.descripcion,
      },
      description: `Se registró la cuenta contable ${cuentaCreada.codigo} - ${cuentaCreada.nombre}`,
    });

    return cuentaCreada;
  });

  return {
    idCuenta: nuevaCuenta.idCuenta,
    codigo: nuevaCuenta.codigo,
    nombre: nuevaCuenta.nombre,
    descripcion: nuevaCuenta.descripcion,
    rubro: {
      idRubro: nuevaCuenta.rubro.idRubro,
      nombre: nuevaCuenta.rubro.nombre,
      tipoCuenta: {
        idTipoCuenta: nuevaCuenta.rubro.tipoCuenta.idTipoCuenta,
        nombre: nuevaCuenta.rubro.tipoCuenta.nombre,
        abreviatura: nuevaCuenta.rubro.tipoCuenta.abreviatura,
      },
    },
  };
}

export async function obtenerTiposCuenta(user: AuthUser) {
  await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  const tipos = await cuentaRepository.findTiposWithRubros();

  return tipos.map((tipo) => ({
    idTipoCuenta: tipo.idTipoCuenta,
    nombre: tipo.nombre,
    abreviatura: tipo.abreviatura,
    descripcion: tipo.descripcion,
    rubros: tipo.rubros.map((rubro) => ({
      idRubro: rubro.idRubro,
      nombre: rubro.nombre,
      descripcion: rubro.descripcion,
    })),
  }));
}

export async function editarCuenta(user: AuthUser, idCuenta: number, data: EditarCuentaDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);
  const cuentaExistente = await cuentaRepository.findByIdOrThrow(idCuenta);

  await cuentaRepository.ensureNombreIsUniqueExcludingId(data.nombre, idCuenta);

  const cuentaActualizada = await transactionRepository.ejecutarTransaccion(async (tx) => {
    const actualizada = await cuentaRepository.updateCuenta(idCuenta, data, tx);

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.CUENTA_CONTABLE,
      entityId: actualizada.idCuenta,
      oldValues: {
        nombre: cuentaExistente.nombre,
        descripcion: cuentaExistente.descripcion,
      },
      newValues: {
        nombre: actualizada.nombre,
        descripcion: actualizada.descripcion,
      },
      description: `Se actualizó la cuenta contable ${actualizada.codigo}`,
    });

    return actualizada;
  });

  return {
    idCuenta: cuentaActualizada.idCuenta,
    codigo: cuentaActualizada.codigo,
    nombre: cuentaActualizada.nombre,
    descripcion: cuentaActualizada.descripcion,
    rubro: {
      idRubro: cuentaActualizada.rubro.idRubro,
      nombre: cuentaActualizada.rubro.nombre,
      tipoCuenta: {
        idTipoCuenta: cuentaActualizada.rubro.tipoCuenta.idTipoCuenta,
        nombre: cuentaActualizada.rubro.tipoCuenta.nombre,
        abreviatura: cuentaActualizada.rubro.tipoCuenta.abreviatura,
      },
    },
  };
}

export async function obtenerCuentas(user: AuthUser, filtros: ObtenerCuentasDTO) {
  await usuarioRepository.findByKeycloakIdOrThrow(user.keycloakId);

  const { totalItems, items } = await cuentaRepository.findAllPaginated(filtros);

  return {
    items: items.map((cuenta) => ({
      idCuenta: cuenta.idCuenta,
      codigo: cuenta.codigo,
      nombre: cuenta.nombre,
      descripcion: cuenta.descripcion,
      rubro: {
        idRubro: cuenta.rubro.idRubro,
        nombre: cuenta.rubro.nombre,
        tipoCuenta: {
          idTipoCuenta: cuenta.rubro.tipoCuenta.idTipoCuenta,
          nombre: cuenta.rubro.tipoCuenta.nombre,
          abreviatura: cuenta.rubro.tipoCuenta.abreviatura,
        },
      },
    })),
    page: filtros.page,
    pageSize: filtros.pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / filtros.pageSize),
  };
}
