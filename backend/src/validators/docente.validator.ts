import { z } from 'zod';

export const crearDocenteSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),

    apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),

    email: z.email('El correo electrónico no es válido'),

    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),

    cursoIds: z.array(z.number().int().positive()).min(1, 'Debe seleccionar al menos un curso'),
  }),
});

export type CrearDocenteDTO = z.infer<typeof crearDocenteSchema>['body'];

export const obtenerEmpresasSchema = z.object({
  query: z.object({
    cursoId: z.coerce.number().int().positive().optional(),

    search: z.string().trim().optional(),

    page: z.coerce.number().int().min(1).default(1),

    pageSize: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type EmpresaDocenteFiltrosDTO = z.infer<typeof obtenerEmpresasSchema>['query'];

export const obtenerEmpresaSchema = z.object({
  params: z.object({
    empresaId: z.coerce.number().int().positive(),
  }),
});

export const obtenerAlumnosSchema = z.object({
  query: z.object({
    cursoId: z.coerce.number().int().positive().optional(),

    empresaId: z.coerce.number().int().positive().optional(),

    search: z.string().trim().optional(),

    page: z.coerce.number().int().positive().default(1),

    pageSize: z.coerce.number().int().positive().max(100).default(10),
  }),
});

export type AlumnoDocenteFiltrosDTO = z.infer<typeof obtenerAlumnosSchema>['query'];
