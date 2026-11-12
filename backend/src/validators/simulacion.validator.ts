import { z } from 'zod';
import {
  DIFICULTADES_SIMULACION,
  DURACIONES_SIMULACION,
  ESTADOS_DASHBOARD_SIMULACION,
  FILTROS_ESTADO_ALUMNO_SIMULACION,
  FILTROS_ESTADO_ENTREGA_SIMULACION,
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

export const editarTituloSimulacionSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID de la simulación debe ser numérico.' })
      .int('El ID de la simulación debe ser un número entero.')
      .positive('El ID de la simulación debe ser mayor a cero.'),
  }),
  body: z.object({
    titulo: z
      .string()
      .trim()
      .min(1, 'El título no puede estar vacío.')
      .max(100, 'El título no puede superar los 100 caracteres.'),
  }),
});

export type EditarTituloSimulacionParamsDTO = z.infer<
  typeof editarTituloSimulacionSchema
>['params'];

export type EditarTituloSimulacionBodyDTO = z.infer<typeof editarTituloSimulacionSchema>['body'];

export const obtenerEntregasSimulacionSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID de la simulación debe ser numérico.' })
      .int('El ID de la simulación debe ser un número entero.')
      .positive('El ID de la simulación debe ser mayor a cero.'),
  }),
  query: z.object({
    page: z.coerce.number().int().positive('La página debe ser mayor a 0.').optional().default(1),
    pageSize: z.coerce
      .number()
      .int()
      .positive('El tamaño de página debe ser mayor a 0.')
      .max(50, 'El tamaño de página no puede exceder 50.')
      .optional()
      .default(6),
    search: z.string().trim().optional(),
    estado: z.enum(FILTROS_ESTADO_ENTREGA_SIMULACION).optional().default('TODAS'),
  }),
});

export type ObtenerEntregasSimulacionParamsDTO = z.infer<
  typeof obtenerEntregasSimulacionSchema
>['params'];

export type ObtenerEntregasSimulacionQueryDTO = z.infer<
  typeof obtenerEntregasSimulacionSchema
>['query'];

export const obtenerSimulacionesAlumnoQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive('La página debe ser mayor a 0.').optional().default(1),
    pageSize: z.coerce
      .number()
      .int()
      .positive('El tamaño de página debe ser mayor a 0.')
      .max(50, 'El tamaño de página no puede exceder 50.')
      .optional()
      .default(6),
    titulo: z.string().trim().optional(),
    estado: z.enum(FILTROS_ESTADO_ALUMNO_SIMULACION).optional(),
  }),
});

export type ObtenerSimulacionesAlumnoQueryDTO = z.infer<
  typeof obtenerSimulacionesAlumnoQuerySchema
>['query'];

export const obtenerConversacionSimulacionSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID de la conversación debe ser numérico.' })
      .int('El ID de la conversación debe ser un número entero.')
      .positive('El ID de la conversación debe ser mayor a cero.'),
  }),
});

export type ObtenerConversacionSimulacionParamsDTO = z.infer<
  typeof obtenerConversacionSimulacionSchema
>['params'];

export const responderDecisionSimulacionSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID de la conversación debe ser numérico.' })
      .int('El ID de la conversación debe ser un número entero.')
      .positive('El ID de la conversación debe ser mayor a cero.'),
  }),
  body: z.object({
    idOpcion: z
      .number({ message: 'El ID de la opción debe ser numérico.' })
      .int('El ID de la opción debe ser un número entero.')
      .positive('El ID de la opción debe ser mayor a cero.'),
  }),
});

export type ResponderDecisionSimulacionParamsDTO = z.infer<
  typeof responderDecisionSimulacionSchema
>['params'];

export type ResponderDecisionSimulacionBodyDTO = z.infer<
  typeof responderDecisionSimulacionSchema
>['body'];

export const obtenerResumenSimulacionSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: 'El ID de la conversación debe ser numérico.' })
      .int('El ID de la conversación debe ser un número entero.')
      .positive('El ID de la conversación debe ser mayor a cero.'),
  }),
});

export type ObtenerResumenSimulacionParamsDTO = z.infer<
  typeof obtenerResumenSimulacionSchema
>['params'];
