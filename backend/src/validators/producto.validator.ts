import { z } from 'zod';

export const crearProductoSchema = z.object({
  body: z.object({
    nombre: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio')
      .max(100, 'El nombre no puede superar los 100 caracteres'),

    stockInicial: z.coerce
      .number()
      .int('El stock inicial debe ser un número entero')
      .min(0, 'El stock inicial no puede ser negativo'),

    precioUnitario: z.coerce.number().positive('El precio unitario debe ser mayor a cero'),

    descripcion: z
      .string()
      .trim()
      .min(1, 'La descripción es obligatoria')
      .max(250, 'La descripción no puede superar los 250 caracteres'),
  }),
});

export type CrearProductoDTO = z.infer<typeof crearProductoSchema>['body'];

export const actualizarProductoSchema = z.object({
  body: z.object({
    nombre: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio')
      .max(100, 'El nombre no puede superar los 100 caracteres'),

    precioUnitario: z
      .number('El precio unitario debe ser un número')
      .positive('El precio unitario debe ser mayor a cero'),

    descripcion: z
      .string()
      .trim()
      .min(1, 'La descripción es obligatoria')
      .max(250, 'La descripción no puede superar los 250 caracteres'),

    fotoUrl: z.string().url().optional().nullable(),
  }),

  params: z.object({
    idProducto: z.coerce.number().int().positive(),
  }),
});

export type ActualizarProductoDTO = z.infer<typeof actualizarProductoSchema>['body'];

export const getProductoSchema = z.object({
  params: z.object({
    idProducto: z.coerce.number().int().positive(),
  }),
});

export const obtenerProductosSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),

    estadoStock: z.enum(['TODOS', 'CON_STOCK', 'SIN_STOCK']).default('TODOS'),

    orden: z.enum(['NOMBRE_ASC', 'NOMBRE_DESC', 'STOCK_ASC', 'STOCK_DESC']).default('NOMBRE_ASC'),

    page: z.coerce.number().int().positive().default(1),

    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type ObtenerProductosDTO = z.infer<typeof obtenerProductosSchema>['query'];

export const eliminarProductoSchema = z.object({
  params: z.object({
    idProducto: z.coerce.number().int().positive(),
  }),
});
