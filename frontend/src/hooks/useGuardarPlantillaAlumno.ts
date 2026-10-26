import { useMutation, useQueryClient } from '@tanstack/react-query';

import { guardarPlantillaAlumno } from '../api/entrega.api';

import type { GuardarPlantillaAlumnoRequest } from '../types/entrega.types';

interface GuardarPlantillaAlumnoParams {
  idEjercicio: number;
  datos: GuardarPlantillaAlumnoRequest;
}

export function useGuardarPlantillaAlumno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idEjercicio, datos }: GuardarPlantillaAlumnoParams) =>
      guardarPlantillaAlumno(idEjercicio, datos),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['entregas', variables.idEjercicio, 'resolucion'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['detalle-ejercicio-alumno', variables.idEjercicio],
      });

      void queryClient.invalidateQueries({
        queryKey: ['ejercicios-alumno'],
      });
    },
  });
}
