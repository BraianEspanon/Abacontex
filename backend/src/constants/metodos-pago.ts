export const METODOS_PAGO = {
  EFECTIVO: 'Efectivo',
  CREDITO: 'Crédito',
  CHEQUE: 'Cheque',
  PAGARE: 'Pagaré',
  TRANSFERENCIA: 'Transferencia',
} as const;

export type MetodosPago = (typeof METODOS_PAGO)[keyof typeof METODOS_PAGO];
