import { OperacionPendienteStrategy } from './asiento-strategy.interface';
import { VentaAsientoStrategy } from './venta-asiento.strategy';
import { MovimientoAsientoStrategy } from './movimiento-asiento.strategy';
import { ConciliacionAsientoStrategy } from './conciliacion-asiento.strategy';
import { NotFoundError } from '../../errors/not-found.error';

const strategies: Record<string, OperacionPendienteStrategy> = {
  VENTA: new VentaAsientoStrategy(),
  MOVIMIENTO_FINANCIERO: new MovimientoAsientoStrategy(),
  CONCILIACION_FINANCIERA: new ConciliacionAsientoStrategy(),
};

export function getAsientoStrategy(tipo: string): OperacionPendienteStrategy {
  const strategy = strategies[tipo];

  if (!strategy) {
    throw new NotFoundError(`Tipo de operación '${tipo}' no reconocido.`);
  }

  return strategy;
}

export function getAllAsientoStrategies(): OperacionPendienteStrategy[] {
  return Object.values(strategies);
}
