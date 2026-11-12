import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  actualizarRevisionPlantilla,
  finalizarCorreccion,
  guardarBorradorCorreccion,
  guardarComentarioError,
  obtenerEspacioTrabajoCorreccion,
  sugerirRetroalimentacionIa,
} from '../api/espacioTrabajoCorreccion.api';

import type {
  ComentarioErrorRequest,
  RetroalimentacionRequest,
  RevisionPlantillaRequest,
} from '../types/espacioTrabajoCorreccion.types';

export function useEspacioTrabajoCorreccion(entregaId: number) {
  return useQuery({
    queryKey: ['correcciones', 'espacio-trabajo', entregaId],
    queryFn: () => obtenerEspacioTrabajoCorreccion(entregaId),
    enabled: Number.isInteger(entregaId) && entregaId > 0,
  });
}

export function useMutacionesCorreccion(entregaId: number) {
  const queryClient = useQueryClient();

  const actualizarDatos = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['correcciones'],
    });
  };

  const revisarPlantilla = useMutation({
    mutationFn: ({
      plantillaId,
      datos,
    }: {
      plantillaId: number;
      datos: RevisionPlantillaRequest;
    }) => actualizarRevisionPlantilla(entregaId, plantillaId, datos),
    onSuccess: actualizarDatos,
  });

  const guardarBorrador = useMutation({
    mutationFn: (datos: RetroalimentacionRequest) => guardarBorradorCorreccion(entregaId, datos),
    onSuccess: actualizarDatos,
  });

  const guardarComentario = useMutation({
    mutationFn: (datos: ComentarioErrorRequest) => guardarComentarioError(entregaId, datos),
    onSuccess: actualizarDatos,
  });

  const sugerirIa = useMutation({
    mutationFn: () => sugerirRetroalimentacionIa(entregaId),
  });

  const finalizar = useMutation({
    mutationFn: (datos: RetroalimentacionRequest) => finalizarCorreccion(entregaId, datos),
    onSuccess: actualizarDatos,
  });

  return {
    revisarPlantilla,
    guardarBorrador,
    guardarComentario,
    sugerirIa,
    finalizar,
  };
}
