import type { Seed } from '../types';

import { cicloLectivoSeed } from './ciclo-lectivo.seed';
import { usuariosSeed } from './usuarios.seed';
import { profesorCursosSeed } from './profesor-cursos.seed';
import { empresasSeed } from './empresas.seed';
import { alumnosSeed } from './alumnos.seed';
import { productosSeed } from './productos.seed';

export const demoSeeds: Seed[] = [
  cicloLectivoSeed,
  usuariosSeed,
  profesorCursosSeed,
  empresasSeed,
  alumnosSeed,
  productosSeed,
];
