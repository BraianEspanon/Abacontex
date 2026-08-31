import { z } from 'zod';

export const registrarCuentaSchema = z.object({
  body: z.object({
    codigo: z
      .string()
      .trim()
      .min(1, 'El código es obligatorio')
      .max(20, 'El código debe tener como máximo 20 caracteres'),

    nombre: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio')
      .max(100, 'El nombre debe tener como máximo 100 caracteres'),

    idRubro: z.number().int().positive('Debe seleccionar un rubro válido'),

    descripcion: z
      .string()
      .trim()
      .min(1, 'La descripción es obligatoria')
      .max(255, 'La descripción debe tener como máximo 255 caracteres'),
  }),
});

export type RegistrarCuentaDTO = z.infer<typeof registrarCuentaSchema>['body'];

export const editarCuentaSchema = z.object({
  params: z.object({
    idCuenta: z.coerce.number().int().positive('ID de cuenta inválido'),
  }),
  body: z.object({
    nombre: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio')
      .max(100, 'El nombre debe tener como máximo 100 caracteres'),

    descripcion: z
      .string()
      .trim()
      .min(1, 'La descripción es obligatoria')
      .max(255, 'La descripción debe tener como máximo 255 caracteres'),
  }),
});

export type EditarCuentaDTO = z.infer<typeof editarCuentaSchema>['body'];

export const obtenerCuentasSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    idTipoCuenta: z.coerce.number().int().positive().optional(),
    idRubro: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type ObtenerCuentasDTO = z.infer<typeof obtenerCuentasSchema>['query'];
