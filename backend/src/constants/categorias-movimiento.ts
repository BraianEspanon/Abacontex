export const CATEGORIAS_MOVIMIENTO = {
  VENTA: 'Ventas',
  COBROS_A_CLIENTES: 'Cobros a clientes',
  PRESTAMOS_RECIBIDOS: 'Préstamos recibidos',
  APORTE_CAPITAL: 'Aportes de capital',
  OTROS_INGRESOS: 'Otros ingresos',
  COMPRAS_DE_MERCADERIA: 'Compras de mercadería',
  PAGO_A_PROVEEDORES: 'Pago a proveedores',
  SUELDOS_Y_JORNALES: 'Sueldos y jornales',
  ALQUILERES: 'Alquileres',
  SERVICIOS: 'Servicios (luz, agua, etc.)',
  IMPUESTOS_Y_TASAS: 'Impuestos y tasas',
  AMORTIZACION_DE_PRESTAMOS: 'Amortización de préstamos',
  INVERSIONES: 'Inversiones',
  OTROS_EGRESOS: 'Otros egresos',
} as const;

export type CategoriaMovimiento =
  (typeof CATEGORIAS_MOVIMIENTO)[keyof typeof CATEGORIAS_MOVIMIENTO];
