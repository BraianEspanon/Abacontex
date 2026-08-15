import { rolesSistemaSeed } from './roles-sistema.seed';
import { rolesEmpresaSeed } from './roles-empresa.seed';
import { tiposMovimientoSeed } from './tipos-movimiento.seed';
import { estadosMovimientoSeed } from './estados-movimiento.seed';
import { metodosPagoSeed } from './metodos-pago.seed';
import { categoriasMovimientoSeed } from './categorias-movimiento.seed';
import { cursosSeed } from './cursos.seed';
import { estadosPedidoSeed } from './estado-pedido.seed';
import type { Seed } from '../types';
import { metodosPagoCursoSeed } from './metodos-pago-curso.seed';
import { estadosOrdenProduccionSeed } from './estadosOrdenProduccionSeed';

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
