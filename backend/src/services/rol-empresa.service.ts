import * as rolesEmpresasRepository from '../repositories/rol-empresa.repository';

export async function getRolesEmpresa() {
  return rolesEmpresasRepository.findAll();
}
