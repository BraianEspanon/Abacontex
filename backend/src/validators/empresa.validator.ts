import { z } from 'zod';

export const crearEmpresaSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100),

  actividad: z.string().trim().min(1, 'La actividad es obligatoria').max(255),

  logoUrl: z.string().url().optional().nullable(),
});

export const agregarParticipantesSchema = z.object({
  participantes: z.array(z.string()).min(1),
});
