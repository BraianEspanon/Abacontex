import { Prisma } from '@prisma/client';
import { AuthUser } from '../types/express';
import { createLog } from '../repositories/audit-log.repository';
import { AuditAction, AuditEntity } from '../constants/audit.constants';
import * as usuarioRepository from '../repositories/usuario.repository';

export interface RegistrarAuditoriaParams {
  tx: Prisma.TransactionClient;
  usuarioId: string;
  action: AuditAction | string;
  entity: AuditEntity | string;
  entityId: string | number;
  empresaId?: number;
  alumnoId?: string;
  oldValues?: any;
  newValues?: any;
  description?: string;
}

/**
 * Registra una acción en el sistema para la trazabilidad (Audit Log).
 * ESTE MÉTODO DEBE SER LLAMADO SIEMPRE DENTRO DEL CALLBACK DE UNA TRANSACCIÓN.
 */
export async function registrarAccion(params: RegistrarAuditoriaParams) {
  // Aseguramos que los valores sean JSON válidos para Prisma o DbNull si no vienen
  const oldValuesParsed = params.oldValues 
    ? (params.oldValues as Prisma.InputJsonValue) 
    : Prisma.DbNull;
    
  const newValuesParsed = params.newValues 
    ? (params.newValues as Prisma.InputJsonValue) 
    : Prisma.DbNull;

  return createLog(
    {
      performedById: params.usuarioId,
      action: params.action,
      entity: params.entity,
      entityId: String(params.entityId),
      empresaId: params.empresaId ?? null,
      alumnoId: params.alumnoId ?? null,
      oldValues: oldValuesParsed,
      newValues: newValuesParsed,
      description: params.description ?? null,
    },
    params.tx
  );
}
