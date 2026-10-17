import { EstadoResolucionAlumnoPlantilla, Prisma, TipoPlantillaEjercicio } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { ObtenerEntregasAlumnoQueryDTO } from '../validators/entrega.validator';

export type EjercicioTableroAlumnoEntity = Prisma.EjercicioGetPayload<{
  include: {
    docente: {
      select: {
        id: true;
        nombre: true;
        apellido: true;
      };
    };
    plantillas: {
      select: {
        idEjercicioPlantilla: true;
        tipo: true;
      };
    };
    entregas: {
      include: {
        resoluciones: {
          select: {
            idResolucionPlantilla: true;
            ejercicioPlantillaId: true;
            estado: true;
          };
        };
        correccion: {
          select: {
            idCorreccion: true;
            fechaCorreccion: true;
          };
        };
      };
    };
  };
}>;

export async function findEjerciciosParaTableroAlumno(
  cursoId: number,
  alumnoId: string,
  filtros: Pick<ObtenerEntregasAlumnoQueryDTO, 'busqueda' | 'docenteId'>,
  tx?: Prisma.TransactionClient
): Promise<EjercicioTableroAlumnoEntity[]> {
  const db = getDbClient(tx);

  const where: Prisma.EjercicioWhereInput = {
    cursoId,
    estado: 'PUBLICADO',
  };

  if (filtros.busqueda) {
    where.titulo = {
      contains: filtros.busqueda,
      mode: 'insensitive',
    };
  }

  if (filtros.docenteId) {
    where.docenteId = filtros.docenteId;
  }

  return db.ejercicio.findMany({
    where,
    orderBy: {
      fechaLimite: 'asc',
    },
    include: {
      docente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
        },
      },
      plantillas: {
        select: {
          idEjercicioPlantilla: true,
          tipo: true,
        },
      },
      entregas: {
        where: {
          alumnoId,
        },
        include: {
          resoluciones: {
            select: {
              idResolucionPlantilla: true,
              ejercicioPlantillaId: true,
              estado: true,
            },
          },
          correccion: {
            select: {
              idCorreccion: true,
              fechaCorreccion: true,
            },
          },
        },
      },
    },
  });
}

export type DocenteCursoEntity = {
  id: string;
  nombre: string;
  apellido: string;
};

export async function findDocentesPorCurso(
  cursoId: number,
  tx?: Prisma.TransactionClient
): Promise<DocenteCursoEntity[]> {
  const db = getDbClient(tx);

  return db.usuario.findMany({
    where: {
      OR: [
        {
          profesorCursos: {
            some: {
              idCurso: cursoId,
            },
          },
        },
        {
          ejerciciosCreados: {
            some: {
              cursoId,
              estado: 'PUBLICADO',
            },
          },
        },
      ],
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
    },
    orderBy: {
      apellido: 'asc',
    },
  });
}

export type EjercicioDetalleAlumnoEntity = Prisma.EjercicioGetPayload<{
  include: {
    docente: {
      select: {
        id: true;
        nombre: true;
        apellido: true;
      };
    };
    curso: {
      select: {
        idCurso: true;
        nombreCurso: true;
        año: true;
      };
    };
    plantillas: {
      select: {
        idEjercicioPlantilla: true;
        tipo: true;
      };
    };
    entregas: {
      include: {
        resoluciones: {
          select: {
            idResolucionPlantilla: true;
            ejercicioPlantillaId: true;
            estado: true;
          };
        };
        correccion: {
          include: {
            plantillas: {
              select: {
                idCorreccionPlantilla: true;
                ejercicioPlantillaId: true;
                estado: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export async function findDetalleEjercicioParaAlumno(
  idEjercicio: number,
  alumnoId: string,
  tx?: Prisma.TransactionClient
): Promise<EjercicioDetalleAlumnoEntity | null> {
  const db = getDbClient(tx);

  return db.ejercicio.findUnique({
    where: {
      idEjercicio,
    },
    include: {
      docente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
        },
      },
      curso: {
        select: {
          idCurso: true,
          nombreCurso: true,
          año: true,
        },
      },
      plantillas: {
        select: {
          idEjercicioPlantilla: true,
          tipo: true,
        },
        orderBy: {
          idEjercicioPlantilla: 'asc',
        },
      },
      entregas: {
        where: {
          alumnoId,
        },
        include: {
          resoluciones: {
            select: {
              idResolucionPlantilla: true,
              ejercicioPlantillaId: true,
              estado: true,
            },
          },
          correccion: {
            include: {
              plantillas: {
                select: {
                  idCorreccionPlantilla: true,
                  ejercicioPlantillaId: true,
                  estado: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export type EntregaConResolucionesEntity = Prisma.EntregaEjercicioGetPayload<{
  include: {
    resoluciones: true;
    correccion: true;
  };
}>;

export type EjercicioConPlantillasEntity = Prisma.EjercicioGetPayload<{
  include: {
    curso: {
      select: {
        idCurso: true;
        nombreCurso: true;
        año: true;
      };
    };
    plantillas: {
      select: {
        idEjercicioPlantilla: true;
        tipo: true;
      };
    };
  };
}>;

export async function findOrCreateEntrega(
  ejercicioId: number,
  alumnoId: string,
  tx?: Prisma.TransactionClient
): Promise<EntregaConResolucionesEntity> {
  const db = getDbClient(tx);

  return db.entregaEjercicio.upsert({
    where: {
      ejercicioId_alumnoId: {
        ejercicioId,
        alumnoId,
      },
    },
    create: {
      ejercicioId,
      alumnoId,
    },
    update: {},
    include: {
      resoluciones: true,
      correccion: true,
    },
  });
}

export async function findEjercicioConPlantillas(
  idEjercicio: number,
  tx?: Prisma.TransactionClient
): Promise<EjercicioConPlantillasEntity | null> {
  const db = getDbClient(tx);

  return db.ejercicio.findUnique({
    where: {
      idEjercicio,
    },
    include: {
      curso: {
        select: {
          idCurso: true,
          nombreCurso: true,
          año: true,
        },
      },
      plantillas: {
        select: {
          idEjercicioPlantilla: true,
          tipo: true,
        },
        orderBy: {
          idEjercicioPlantilla: 'asc',
        },
      },
    },
  });
}

export type EjercicioPlantillaEntity = Prisma.EjercicioPlantillaGetPayload<{}>;

export async function findEjercicioPlantillaPorTipo(
  ejercicioId: number,
  tipo: TipoPlantillaEjercicio,
  tx?: Prisma.TransactionClient
): Promise<EjercicioPlantillaEntity | null> {
  const db = getDbClient(tx);

  return db.ejercicioPlantilla.findUnique({
    where: {
      ejercicioId_tipo: {
        ejercicioId,
        tipo,
      },
    },
  });
}

export type ResolucionAlumnoPlantillaEntity = Prisma.ResolucionAlumnoPlantillaGetPayload<{}>;

export async function upsertResolucionAlumnoPlantilla(
  entregaId: number,
  ejercicioPlantillaId: number,
  data: {
    estado: EstadoResolucionAlumnoPlantilla;
    contenido: Prisma.InputJsonValue;
  },
  tx?: Prisma.TransactionClient
): Promise<ResolucionAlumnoPlantillaEntity> {
  const db = getDbClient(tx);

  return db.resolucionAlumnoPlantilla.upsert({
    where: {
      entregaId_ejercicioPlantillaId: {
        entregaId,
        ejercicioPlantillaId,
      },
    },
    create: {
      entregaId,
      ejercicioPlantillaId,
      estado: data.estado,
      contenido: data.contenido,
    },
    update: {
      estado: data.estado,
      contenido: data.contenido,
    },
  });
}

export async function finalizarEntregaAlumno(
  idEntrega: number,
  fechaEntrega: Date,
  tx?: Prisma.TransactionClient
): Promise<EntregaConResolucionesEntity> {
  const db = getDbClient(tx);

  return db.entregaEjercicio.update({
    where: {
      idEntrega,
    },
    data: {
      fechaEntrega,
    },
    include: {
      resoluciones: true,
      correccion: true,
    },
  });
}
