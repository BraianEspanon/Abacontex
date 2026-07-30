import { useMutation } from '@tanstack/react-query';
import { completarRegistroAlumno } from '../api/alumno.api';

export function useAssignRole() {
  return useMutation({
    mutationFn: completarRegistroAlumno,
  });
}
