import { MovimientoCuentaContable } from '@prisma/client';

export interface TipoMovimientoAsientoInfo {
  codigo: MovimientoCuentaContable;
  simbolo: string;
  nombre: string;
  columnaSugerida: 'DEBE' | 'HABER';
  descripcion: string;
}

export const MAPA_TIPOS_MOVIMIENTO: Record<
  MovimientoCuentaContable,
  Omit<TipoMovimientoAsientoInfo, 'codigo'>
> = {
  [MovimientoCuentaContable.A_MAS]: {
    simbolo: 'A+',
    nombre: 'Activo que aumenta',
    columnaSugerida: 'DEBE',
    descripcion: 'Aumento de bienes propios o derechos a cobrar',
  },
  [MovimientoCuentaContable.A_MENOS]: {
    simbolo: 'A-',
    nombre: 'Activo que disminuye',
    columnaSugerida: 'HABER',
    descripcion: 'Disminución de bienes propios o derechos a cobrar',
  },
  [MovimientoCuentaContable.P_MAS]: {
    simbolo: 'P+',
    nombre: 'Pasivo que aumenta',
    columnaSugerida: 'HABER',
    descripcion: 'Aumento de deudas u obligaciones a pagar',
  },
  [MovimientoCuentaContable.P_MENOS]: {
    simbolo: 'P-',
    nombre: 'Pasivo que disminuye',
    columnaSugerida: 'DEBE',
    descripcion: 'Disminución de deudas u obligaciones a pagar',
  },
  [MovimientoCuentaContable.PN]: {
    simbolo: 'PN',
    nombre: 'Patrimonio Neto',
    columnaSugerida: 'HABER',
    descripcion: 'Variación en el patrimonio neto o aportes de capital',
  },
  [MovimientoCuentaContable.R_MAS]: {
    simbolo: 'R+',
    nombre: 'Resultado Positivo',
    columnaSugerida: 'HABER',
    descripcion: 'Ganancias, ventas u otros ingresos',
  },
  [MovimientoCuentaContable.R_MENOS]: {
    simbolo: 'R-',
    nombre: 'Resultado Negativo',
    columnaSugerida: 'DEBE',
    descripcion: 'Pérdidas, costos, gastos u otros egresos',
  },
};

export const TIPOS_MOVIMIENTO_ASIENTO: TipoMovimientoAsientoInfo[] = Object.values(
  MovimientoCuentaContable
).map((codigo) => ({
  codigo,
  ...MAPA_TIPOS_MOVIMIENTO[codigo],
}));
