import { useMutation } from '@tanstack/react-query';

import { crearInvitacionesEmpresa, type CrearInvitacionesRequest } from '../api/invitacion.api';

export function useCrearInvitacionesEmpresa() {
  return useMutation({
    mutationFn: (datos: CrearInvitacionesRequest) => crearInvitacionesEmpresa(datos),
  });
}
