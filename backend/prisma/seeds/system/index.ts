import { rolesSistemaSeed } from './roles-sistema.seed';
import { rolesEmpresaSeed } from './roles-empresa.seed';
import { tiposMovimientoSeed } from './tipos-movimiento.seed';
import { estadosMovimientoSeed } from './estados-movimiento.seed';
import { metodosPagoSeed } from './metodos-pago.seed';
import { categoriasMovimientoSeed } from './categorias-movimiento.seed';
import type { Seed } from '../types';
import { estadosPedidoSeed } from './estado-pedido.seed';

export const systemSeeds: Seed[] = [
  rolesSistemaSeed,
  rolesEmpresaSeed,
  tiposMovimientoSeed,
  estadosMovimientoSeed,
  metodosPagoSeed,
  categoriasMovimientoSeed,
  estadosPedidoSeed,
];
