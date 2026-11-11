import { z } from 'zod';
import {
  DIFICULTADES_SIMULACION,
  DURACIONES_SIMULACION,
  FLUJOS_EMPRESARIALES,
  TIPOS_EVENTO_SORPRESA,
} from '../constants/simulacion.constants';

export const crearSimulacionSchema = z.object({
  body: z.object({
    cursoId: z.coerce
      .number()
      .int('El ID del curso debe ser un número entero.')
      .positive('El curso es obligatorio y debe ser un ID válido.'),
    flujoEmpresarial: z.enum(FLUJOS_EMPRESARIALES),
    dificultad: z.enum(DIFICULTADES_SIMULACION),
    duracion: z.enum(DURACIONES_SIMULACION),
    eventosSorpresa: z.boolean(),
    tipoEventoSorpresa: z.enum(TIPOS_EVENTO_SORPRESA).optional(),
    usarDatosEmpresa: z.boolean(),
    fechaLimite: z
      .string()
      .trim()
      .min(1, 'La fecha límite es obligatoria.')
      .datetime('La fecha límite debe ser una fecha y hora ISO válida.'),
  }),
});

export type CrearSimulacionDTO = z.infer<typeof crearSimulacionSchema>['body'];
