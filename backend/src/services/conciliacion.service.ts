import { AuthUser } from '../types/express';
import { Prisma } from '@prisma/client';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '../constants/audit.constants';

import * as auditLogService from './audit-log.service';
import * as usuarioService from './usuario.service';

import * as conciliacionRepository from '../repositories/conciliacion.repository';
import * as movimientoFinancieroRepository from '../repositories/movimiento-financiero.repository';
import * as transactionRepository from '../repositories/transaction.repository';

import {
  RegistrarConciliacionDTO,
  ConsultarHistorialConciliacionesDTO,
} from '../validators/conciliacion.validator';

import { ConciliacionMapper } from '../dto/finanzas/conciliacion.mapper';

import { ConflictError } from '../errors/conflict.error';
import { BadRequestError } from '../errors/bad-request-error';

async function calcularEstadoCaja(idEmpresa: number) {
  const ultimaConciliacion = await conciliacionRepository.findUltimaByEmpresa(idEmpresa);

  const fechaDesde = ultimaConciliacion ? ultimaConciliacion.createdAt : undefined;
  const movimientos = await movimientoFinancieroRepository.findRegistradosPosterioresA(
    idEmpresa,
    fechaDesde
  );

  const saldoBase = ultimaConciliacion ? Number(ultimaConciliacion.saldoContado) : 0;

  let totalIngresos = 0;
  let totalEgresos = 0;

  for (const mov of movimientos) {
    const importe = Number(mov.importe);
    if (mov.categoria.tipoMovimiento.nombre === 'INGRESO') {
      totalIngresos += importe;
    } else {
      totalEgresos += importe;
    }
  }

  const saldoEsperado = saldoBase + totalIngresos - totalEgresos;

  return {
    ultimaConciliacion,
    movimientos,
    saldoEsperado,
  };
}

export async function obtenerResumenConciliacion(user: AuthUser) {
  const usuario = await usuarioService.getAlumnoConEmpresaOrThrow(user);
  const idEmpresa = usuario.alumno.empresa.id;

  const { ultimaConciliacion, movimientos, saldoEsperado } = await calcularEstadoCaja(idEmpresa);

  return {
    saldoEsperado,
    movimientosPeriodo: movimientos.length,
    ultimaConciliacion: ultimaConciliacion ? ultimaConciliacion.fecha : null,
  };
}

export async function registrarConciliacion(user: AuthUser, data: RegistrarConciliacionDTO) {
  const usuario = await usuarioService.getAlumnoConEmpresaOrThrow(user);
  const idEmpresa = usuario.alumno.empresa.id;
  const idAlumno = usuario.alumno.id;

  const { saldoEsperado } = await calcularEstadoCaja(idEmpresa);

  if (Number(data.saldoEsperado) !== Number(saldoEsperado)) {
    throw new ConflictError(
      'Se registraron nuevos movimientos financieros durante la conciliación. Por favor, actualiza los datos y vuelve a verificar el saldo.'
    );
  }

  const diferencia = data.saldoContado - saldoEsperado;

  if (diferencia !== 0 && (!data.observacion || data.observacion.trim() === '')) {
    throw new BadRequestError(
      'La observación es obligatoria cuando existe una diferencia entre el saldo esperado y el saldo contado.'
    );
  }

  return transactionRepository.ejecutarTransaccion(async (tx) => {
    const conciliacion = await conciliacionRepository.create(
      {
        empresaId: idEmpresa,
        alumnoId: idAlumno,
        fecha: new Date(),
        saldoEsperado: new Prisma.Decimal(saldoEsperado),
        saldoContado: new Prisma.Decimal(data.saldoContado),
        diferencia: new Prisma.Decimal(diferencia),
        observacion: data.observacion ? data.observacion.trim() : null,
      },
      tx
    );

    await auditLogService.registrarAccion({
      tx,
      usuarioId: usuario.id,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.CONCILIACION,
      entityId: conciliacion.idConciliacion,
      empresaId: idEmpresa,
      newValues: {
        idConciliacion: conciliacion.idConciliacion,
        empresaId: idEmpresa,
        fecha: conciliacion.fecha,
        saldoEsperado,
        saldoContado: data.saldoContado,
        diferencia,
        observacion: data.observacion ? data.observacion.trim() : null,
      },
      description: 'Se registró una nueva conciliación de caja',
    });

    return {
      idConciliacion: conciliacion.idConciliacion,
      empresaId: conciliacion.empresaId,
      alumnoId: conciliacion.alumnoId,
      fecha: conciliacion.fecha,
      saldoEsperado: Number(conciliacion.saldoEsperado),
      saldoContado: Number(conciliacion.saldoContado),
      diferencia: Number(conciliacion.diferencia),
      observacion: conciliacion.observacion,
      createdAt: conciliacion.createdAt,
    };
  });
}

export async function obtenerHistorial(user: AuthUser, query: ConsultarHistorialConciliacionesDTO) {
  const usuario = await usuarioService.getAlumnoConEmpresaOrThrow(user);
  const idEmpresa = usuario.alumno.empresa.id;

  const paginacion = await conciliacionRepository.findHistorial(idEmpresa, query);
  const totalPages = Math.ceil(paginacion.total / query.pageSize);

  return {
    items: paginacion.items.map(ConciliacionMapper.toHistorialDTO),
    page: query.page,
    pageSize: query.pageSize,
    totalItems: paginacion.total,
    totalPages,
  };
}
