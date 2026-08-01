import { z } from 'zod';

export const crearEmpresaSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100),

    actividad: z.string().trim().min(1, 'La actividad es obligatoria').max(255),
  }),
});

export type CrearEmpresaDTO = z.infer<typeof crearEmpresaSchema>['body'];

export const agregarParticipantesSchema = z.object({
  body: z.object({
    participantes: z.array(z.string()).min(1),
  }),
});

export type AgregarParticipantesDTO = z.infer<typeof agregarParticipantesSchema>['body'];

export const cambiarRolParticipanteSchema = z.object({
  body: z.object({
    idRolEmpresa: z.number().int().positive(),
  }),

  params: z.object({
    idAlumno: z.string().uuid(),
  }),
});

export const modificarRolesEmpresaSchema = z.object({
  body: z.object({
    roles: z
      .array(
        z.object({
          idAlumno: z.string().uuid(),
          idRolEmpresa: z.number().int().positive(),
        })
      )
      .min(1),
  }),

  params: z.object({
    idEmpresa: z.coerce.number().int().positive(),
  }),
});

export type ModificarRolesDTO = z.infer<typeof modificarRolesEmpresaSchema>['body']['roles'];
