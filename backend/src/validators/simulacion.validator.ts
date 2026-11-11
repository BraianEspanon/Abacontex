import { z } from 'zod';
import {
  DIFICULTADES_SIMULACION,
  DURACIONES_SIMULACION,
  ESTADOS_DASHBOARD_SIMULACION,
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

export const obtenerSimulacionesDocenteQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive('La página debe ser mayor a 0.').optional().default(1),
    pageSize: z.coerce
      .number()
      .int()
      .positive('El tamaño de página debe ser mayor a 0.')
      .max(50, 'El tamaño de página no puede exceder 50.')
      .optional()
      .default(6),
    cursoId: z.coerce.number().int().positive('ID de curso inválido.').optional(),
    titulo: z.string().trim().optional(),
    estado: z.enum(ESTADOS_DASHBOARD_SIMULACION).optional(),
  }),
});

export type ObtenerSimulacionesDocenteQueryDTO = z.infer<
  typeof obtenerSimulacionesDocenteQuerySchema
>['query'];
