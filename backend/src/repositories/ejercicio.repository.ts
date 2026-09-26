import { Prisma } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { CrearEjercicioDTO } from '../validators/ejercicio.validator';

const ejercicioCreadoInclude = {
  curso: true,
  plantillas: true,
  generacionIA: {
    include: {
      contenidos: true,
    },
  },
  resolucion: true,
} as const;

export type EjercicioCreadoEntity = Prisma.EjercicioGetPayload<{
  include: typeof ejercicioCreadoInclude;
}>;

export async function crearEjercicio(
  docenteId: string,
  data: CrearEjercicioDTO,
  fechaLimite: Date,
  tx?: Prisma.TransactionClient
): Promise<EjercicioCreadoEntity> {
  const db = getDbClient(tx);

  return db.ejercicio.create({
    data: {
      docenteId,
      cursoId: data.cursoId,
      titulo: data.titulo,
      enunciado: data.enunciado,
      fechaLimite,
      indicaciones: data.indicaciones ?? null,
      estado: data.estado,
      plantillas: {
        create: data.plantillas.map((tipo) => ({ tipo })),
      },
      resolucion: {
        create: {
          estado: 'PENDIENTE',
        },
      },
      ...(data.generacionIA
        ? {
            generacionIA: {
              create: {
                tipoEjercicio: data.generacionIA.tipoEjercicio,
                dificultad: data.generacionIA.dificultad,
                contextoAdicional: data.generacionIA.contextoAdicional ?? null,
                ...(data.generacionIA.contenidos?.length
                  ? {
                      contenidos: {
                        create: data.generacionIA.contenidos.map((contenido) => ({ contenido })),
                      },
                    }
                  : {}),
              },
            },
          }
        : {}),
    },
    include: ejercicioCreadoInclude,
  });
}
