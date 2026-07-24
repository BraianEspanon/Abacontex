import { useMutation } from '@tanstack/react-query';
import {
  agregarParticipantesEmpresa,
  type AgregarParticipantesRequest,
} from '../api/empresa.api';

export function useAgregarParticipantesEmpresa() {
  return useMutation({
    mutationFn: (datos: AgregarParticipantesRequest) =>
      agregarParticipantesEmpresa(datos),
  });
}