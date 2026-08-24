import type { Seed } from '../types';

import { categoriasMovimientoSeed } from './categorias-movimiento.seed';
import { cursosSeed } from './cursos.seed';
import { estadosMovimientoSeed } from './estados-movimiento.seed';
import { estadosOrdenProduccionSeed } from './estadosOrdenProduccionSeed';
import { estadosPedidoSeed } from './estado-pedido.seed';
import { metodosPagoCursoSeed } from './metodos-pago-curso.seed';
import { metodosPagoSeed } from './metodos-pago.seed';
import { rolesEmpresaSeed } from './roles-empresa.seed';
import { rolesSistemaSeed } from './roles-sistema.seed';
import { tiposMovimientoSeed } from './tipos-movimiento.seed';

export const systemSeeds: Seed[] = [
  rolesSistemaSeed,
  rolesEmpresaSeed,
  tiposMovimientoSeed,
  estadosMovimientoSeed,
  metodosPagoSeed,
  categoriasMovimientoSeed,
  estadosPedidoSeed,
  cursosSeed,
  metodosPagoCursoSeed,
  estadosOrdenProduccionSeed,
];
