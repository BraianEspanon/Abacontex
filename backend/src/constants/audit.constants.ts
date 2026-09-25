export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  INICIAR_PRODUCCION: 'INICIAR_PRODUCCION',
  FINALIZAR_PRODUCCION: 'FINALIZAR_PRODUCCION',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  ACEPTAR_INVITACION: 'ACEPTAR_INVITACION',
  RECHAZAR_INVITACION: 'RECHAZAR_INVITACION',
  FINALIZAR_INVITACION: 'FINALIZAR_INVITACION',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export const AUDIT_ENTITIES = {
  PRODUCTO: 'Producto',
  PEDIDO: 'Pedido',
  ORDEN_PRODUCCION: 'OrdenProduccion',
  VENTA: 'Venta',
  EMPRESA: 'Empresa',
  USUARIO: 'Usuario',
  ALUMNO: 'Alumno',
  INVITACION: 'Invitacion',
  PLANIFICACION: 'Planificacion',
  DETALLE_PLANIFICACION: 'DetallePlanificacion',
  MOVIMIENTO_FINANCIERO: 'MovimientoFinanciero',
  FACTURA: 'Factura',
  CONCILIACION: 'Conciliacion',
  CUENTA_CONTABLE: 'CuentaContable',
  ASIENTO_CONTABLE: 'AsientoContable',
} as const;

export type AuditEntity = (typeof AUDIT_ENTITIES)[keyof typeof AUDIT_ENTITIES];
