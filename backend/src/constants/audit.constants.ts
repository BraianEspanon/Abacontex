export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  INICIAR_PRODUCCION: 'INICIAR_PRODUCCION',
  FINALIZAR_PRODUCCION: 'FINALIZAR_PRODUCCION',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export const AUDIT_ENTITIES = {
  PRODUCTO: 'Producto',
  PEDIDO: 'Pedido',
  ORDEN_PRODUCCION: 'OrdenProduccion',
  VENTA: 'Venta',
  EMPRESA: 'Empresa',
} as const;

export type AuditEntity = (typeof AUDIT_ENTITIES)[keyof typeof AUDIT_ENTITIES];
