import * as cursoRepository from '../repositories/curso.repository';

export async function getCursos() {
  return cursoRepository.findAll();
}
