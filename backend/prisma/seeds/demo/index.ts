import type { Seed } from '../types';

import { usuariosSeed } from './usuarios.seed';
import { profesorCursosSeed } from './profesor-cursos.seed';
import { empresasSeed } from './empresas.seed';
import { alumnosSeed } from './alumnos.seed';
import { productosSeed } from './productos.seed';
import { pedidosSeed } from './pedidos.seed';
import { ventasSeed } from './ventas.seed';

export const demoSeeds: Seed[] = [
  usuariosSeed,
  profesorCursosSeed,
  empresasSeed,
  alumnosSeed,
  productosSeed,
  pedidosSeed,
  ventasSeed,
];
