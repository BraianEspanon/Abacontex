import type { Seed } from '../types';

import { cicloLectivoSeed } from './ciclo-lectivo.seed';
import { cursosSeed } from './cursos.seed';
import { usuariosSeed } from './usuarios.seed';
import { profesorCursosSeed } from './profesor-cursos.seed';
import { empresasSeed } from './empresas.seed';
import { alumnosSeed } from './alumnos.seed';
import { productosSeed } from './productos.seed';

export const demoSeeds: Seed[] = [
  cicloLectivoSeed,
  cursosSeed,
  usuariosSeed,
  profesorCursosSeed,
  empresasSeed,
  alumnosSeed,
  productosSeed,
];
