import { EstadoCorreccionPlantilla, Prisma, TipoErrorCorreccion } from '@prisma/client';
import { getDbClient } from '../lib/prisma';
import { ObtenerEjerciciosACorregirQueryDTO } from '../validators/correccion.validator';

export type EjercicioTableroCorreccionEntity = Prisma.EjercicioGetPayload<{
  include: {
    curso: {
      select: {
        idCurso: true;
        nombreCurso: true;
        _count: {
          select: {
            alumnos: true;
          };
        };
      };
    };
    resolucion: {
      select: {
        idResolucion: true;
        estado: true;
      };
    };
    entregas: {
      where: {
        fechaEntrega: { not: null };
      };
      select: {
        idEntrega: true;
        fechaEntrega: true;
        correccion: {
          select: {
            idCorreccion: true;
            fechaCorreccion: true;
            plantillas: {
              select: {
                idCorreccionPlantilla: true;
                estado: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export async function findEjerciciosParaTableroCorreccion(
  docenteId: string,
  filtros: Pick<ObtenerEjerciciosACorregirQueryDTO, 'busqueda' | 'cursoId'>,
  tx?: Prisma.TransactionClient
): Promise<EjercicioTableroCorreccionEntity[]> {
  const db = getDbClient(tx);

  const where: Prisma.EjercicioWhereInput = {
    docenteId,
    estado: { in: ['PUBLICADO', 'FINALIZADO'] },
  };

  if (filtros.cursoId) {
    where.cursoId = filtros.cursoId;
  }

  if (filtros.busqueda) {
    where.titulo = {
      contains: filtros.busqueda,
      mode: 'insensitive',
    };
  }

  return db.ejercicio.findMany({
    where,
    orderBy: {
      fechaLimite: 'desc',
    },
    include: {
      curso: {
        select: {
          idCurso: true,
          nombreCurso: true,
          _count: {
            select: {
              alumnos: true,
            },
          },
        },
      },
      resolucion: {
        select: {
          idResolucion: true,
          estado: true,
        },
      },
      entregas: {
        where: {
          fechaEntrega: { not: null },
        },
        select: {
          idEntrega: true,
          fechaEntrega: true,
          correccion: {
            select: {
              idCorreccion: true,
              fechaCorreccion: true,
              plantillas: {
                select: {
                  idCorreccionPlantilla: true,
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

export type DetalleEjercicioEntregasEntity = Prisma.EjercicioGetPayload<{
  include: {
    curso: {
      select: {
        idCurso: true;
        nombreCurso: true;
        alumnos: {
          select: {
            id: true;
            usuario: {
              select: {
                nombre: true;
                apellido: true;
                email: true;
                fotoPerfilUrl: true;
              };
            };
          };
        };
      };
    };
    plantillas: {
      select: {
        idEjercicioPlantilla: true;
        tipo: true;
      };
    };
    resolucion: {
      select: {
        idResolucion: true;
        estado: true;
      };
    };
    entregas: {
      select: {
        idEntrega: true;
        alumnoId: true;
        fechaEntrega: true;
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
            retroalimentacion: true;
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

export async function findEjercicioConEntregasYAlumnos(
  ejercicioId: number,
  docenteId: string,
  tx?: Prisma.TransactionClient
): Promise<DetalleEjercicioEntregasEntity | null> {
  const db = getDbClient(tx);

  return db.ejercicio.findFirst({
    where: {
      idEjercicio: ejercicioId,
      docenteId,
    },
    include: {
      curso: {
        select: {
          idCurso: true,
          nombreCurso: true,
          alumnos: {
            select: {
              id: true,
              usuario: {
                select: {
                  nombre: true,
                  apellido: true,
                  email: true,
                  fotoPerfilUrl: true,
                },
              },
            },
          },
        },
      },
      plantillas: {
        select: {
          idEjercicioPlantilla: true,
          tipo: true,
        },
      },
      resolucion: {
        select: {
          idResolucion: true,
          estado: true,
        },
      },
      entregas: {
        select: {
          idEntrega: true,
          alumnoId: true,
          fechaEntrega: true,
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
              retroalimentacion: true,
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

export type EntregaEspacioTrabajoEntity = Prisma.EntregaEjercicioGetPayload<{
  include: {
    alumno: {
      select: {
        id: true;
        usuario: {
          select: {
            nombre: true;
            apellido: true;
            email: true;
            fotoPerfilUrl: true;
          };
        };
        curso: {
          select: {
            idCurso: true;
            nombreCurso: true;
          };
        };
      };
    };
    ejercicio: {
      select: {
        idEjercicio: true;
        titulo: true;
        enunciado: true;
        indicaciones: true;
        fechaLimite: true;
        curso: {
          select: {
            idCurso: true;
            nombreCurso: true;
          };
        };
        plantillas: {
          select: {
            idEjercicioPlantilla: true;
            tipo: true;
          };
        };
        resolucion: {
          select: {
            idResolucion: true;
            estado: true;
            plantillas: {
              select: {
                idResolucionPlantilla: true;
                ejercicioPlantillaId: true;
                estado: true;
                contenido: true;
              };
            };
          };
        };
      };
    };
    resoluciones: {
      select: {
        idResolucionPlantilla: true;
        ejercicioPlantillaId: true;
        estado: true;
        contenido: true;
      };
    };
    correccion: {
      select: {
        idCorreccion: true;
        retroalimentacion: true;
        fechaCorreccion: true;
        plantillas: {
          select: {
            idCorreccionPlantilla: true;
            ejercicioPlantillaId: true;
            estado: true;
          };
        };
        errores: {
          select: {
            idError: true;
            ejercicioPlantillaId: true;
            tipoError: true;
            detalle: true;
            comentarioDocente: true;
          };
        };
      };
    };
  };
}>;

export async function findEntregaParaEspacioTrabajo(
  entregaId: number,
  docenteId: string,
  tx?: Prisma.TransactionClient
): Promise<EntregaEspacioTrabajoEntity | null> {
  const db = getDbClient(tx);

  return db.entregaEjercicio.findFirst({
    where: {
      idEntrega: entregaId,
      ejercicio: {
        docenteId,
      },
    },
    include: {
      alumno: {
        select: {
          id: true,
          usuario: {
            select: {
              nombre: true,
              apellido: true,
              email: true,
              fotoPerfilUrl: true,
            },
          },
          curso: {
            select: {
              idCurso: true,
              nombreCurso: true,
            },
          },
        },
      },
      ejercicio: {
        select: {
          idEjercicio: true,
          titulo: true,
          enunciado: true,
          indicaciones: true,
          fechaLimite: true,
          curso: {
            select: {
              idCurso: true,
              nombreCurso: true,
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
          resolucion: {
            select: {
              idResolucion: true,
              estado: true,
              plantillas: {
                select: {
                  idResolucionPlantilla: true,
                  ejercicioPlantillaId: true,
                  estado: true,
                  contenido: true,
                },
              },
            },
          },
        },
      },
      resoluciones: {
        select: {
          idResolucionPlantilla: true,
          ejercicioPlantillaId: true,
          estado: true,
          contenido: true,
        },
      },
      correccion: {
        select: {
          idCorreccion: true,
          retroalimentacion: true,
          fechaCorreccion: true,
          plantillas: {
            select: {
              idCorreccionPlantilla: true,
              ejercicioPlantillaId: true,
              estado: true,
            },
          },
          errores: {
            select: {
              idError: true,
              ejercicioPlantillaId: true,
              tipoError: true,
              detalle: true,
              comentarioDocente: true,
            },
          },
        },
      },
    },
  });
}

export type EntregaParaRevisionPlantillaEntity = Prisma.EntregaEjercicioGetPayload<{
  include: {
    ejercicio: {
      select: {
        idEjercicio: true;
        docenteId: true;
        plantillas: {
          select: {
            idEjercicioPlantilla: true;
            tipo: true;
          };
        };
      };
    };
    correccion: {
      select: {
        idCorreccion: true;
        docenteId: true;
        fechaCorreccion: true;
        plantillas: {
          select: {
            idCorreccionPlantilla: true;
            ejercicioPlantillaId: true;
            estado: true;
          };
        };
        errores: {
          select: {
            idError: true;
            ejercicioPlantillaId: true;
            tipoError: true;
            detalle: true;
            comentarioDocente: true;
          };
        };
      };
    };
  };
}>;

export async function findEntregaParaRevisionPlantilla(
  entregaId: number,
  tx?: Prisma.TransactionClient
): Promise<EntregaParaRevisionPlantillaEntity | null> {
  const db = getDbClient(tx);
  return db.entregaEjercicio.findUnique({
    where: { idEntrega: entregaId },
    include: {
      ejercicio: {
        select: {
          idEjercicio: true,
          docenteId: true,
          plantillas: {
            select: {
              idEjercicioPlantilla: true,
              tipo: true,
            },
          },
        },
      },
      correccion: {
        select: {
          idCorreccion: true,
          docenteId: true,
          fechaCorreccion: true,
          plantillas: {
            select: {
              idCorreccionPlantilla: true,
              ejercicioPlantillaId: true,
              estado: true,
            },
          },
          errores: {
            select: {
              idError: true,
              ejercicioPlantillaId: true,
              tipoError: true,
              detalle: true,
              comentarioDocente: true,
            },
          },
        },
      },
    },
  });
}

export async function upsertCorreccionPlantilla(
  entregaId: number,
  docenteId: string,
  ejercicioPlantillaId: number,
  estado: EstadoCorreccionPlantilla,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  const correccion = await db.correccionEntrega.upsert({
    where: { entregaId },
    create: {
      entregaId,
      docenteId,
    },
    update: {},
  });

  return db.correccionPlantilla.upsert({
    where: {
      correccionId_ejercicioPlantillaId: {
        correccionId: correccion.idCorreccion,
        ejercicioPlantillaId,
      },
    },
    create: {
      correccionId: correccion.idCorreccion,
      ejercicioPlantillaId,
      estado,
    },
    update: {
      estado,
    },
    select: {
      idCorreccionPlantilla: true,
      correccionId: true,
      ejercicioPlantillaId: true,
      estado: true,
    },
  });
}

export async function upsertBorradorCorreccion(
  entregaId: number,
  docenteId: string,
  retroalimentacion: string | null,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  return db.correccionEntrega.upsert({
    where: { entregaId },
    create: {
      entregaId,
      docenteId,
      retroalimentacion,
    },
    update: {
      retroalimentacion,
    },
    select: {
      idCorreccion: true,
      entregaId: true,
      docenteId: true,
      retroalimentacion: true,
      fechaCorreccion: true,
    },
  });
}

export type EntregaParaFinalizarEntity = Prisma.EntregaEjercicioGetPayload<{
  include: {
    alumno: {
      select: {
        id: true;
        usuario: {
          select: {
            id: true;
            nombre: true;
            apellido: true;
            email: true;
          };
        };
      };
    };
    ejercicio: {
      select: {
        idEjercicio: true;
        docenteId: true;
        titulo: true;
        plantillas: {
          select: {
            idEjercicioPlantilla: true;
            tipo: true;
          };
        };
        resolucion: {
          select: {
            idResolucion: true;
            plantillas: {
              select: {
                idResolucionPlantilla: true;
                ejercicioPlantillaId: true;
                contenido: true;
              };
            };
          };
        };
      };
    };
    resoluciones: {
      select: {
        idResolucionPlantilla: true;
        ejercicioPlantillaId: true;
        estado: true;
        contenido: true;
      };
    };
    correccion: {
      select: {
        idCorreccion: true;
        docenteId: true;
        fechaCorreccion: true;
        retroalimentacion: true;
        plantillas: {
          select: {
            idCorreccionPlantilla: true;
            ejercicioPlantillaId: true;
            estado: true;
          };
        };
        errores: {
          select: {
            idError: true;
            ejercicioPlantillaId: true;
            tipoError: true;
            detalle: true;
            comentarioDocente: true;
          };
        };
      };
    };
  };
}>;

export async function findEntregaParaFinalizar(
  entregaId: number,
  tx?: Prisma.TransactionClient
): Promise<EntregaParaFinalizarEntity | null> {
  const db = getDbClient(tx);
  return db.entregaEjercicio.findUnique({
    where: { idEntrega: entregaId },
    include: {
      alumno: {
        select: {
          id: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      },
      ejercicio: {
        select: {
          idEjercicio: true,
          docenteId: true,
          titulo: true,
          plantillas: {
            select: {
              idEjercicioPlantilla: true,
              tipo: true,
            },
          },
          resolucion: {
            select: {
              idResolucion: true,
              plantillas: {
                select: {
                  idResolucionPlantilla: true,
                  ejercicioPlantillaId: true,
                  contenido: true,
                },
              },
            },
          },
        },
      },
      resoluciones: {
        select: {
          idResolucionPlantilla: true,
          ejercicioPlantillaId: true,
          estado: true,
          contenido: true,
        },
      },
      correccion: {
        select: {
          idCorreccion: true,
          docenteId: true,
          fechaCorreccion: true,
          retroalimentacion: true,
          plantillas: {
            select: {
              idCorreccionPlantilla: true,
              ejercicioPlantillaId: true,
              estado: true,
            },
          },
          errores: {
            select: {
              idError: true,
              ejercicioPlantillaId: true,
              tipoError: true,
              detalle: true,
              comentarioDocente: true,
            },
          },
        },
      },
    },
  });
}

export interface ErrorParaPersistirData {
  ejercicioPlantillaId: number;
  tipoError: TipoErrorCorreccion;
  detalle: Prisma.InputJsonValue;
  comentarioDocente?: string | null | undefined;
}

export interface FinalizarCorreccionParams {
  entregaId: number;
  docenteId: string;
  docenteNombre?: string;
  alumnoUsuarioId: string;
  ejercicioId: number;
  tituloEjercicio: string;
  fechaCorreccion: Date;
  retroalimentacion?: string | null | undefined;
  errores: ErrorParaPersistirData[];
}

export async function finalizarCorreccionTransaccion(params: FinalizarCorreccionParams) {
  const db = getDbClient();

  return db.$transaction(async (tx) => {
    // 1. Upsert cabecera de corrección y marcar fecha de corrección
    const correccion = await tx.correccionEntrega.upsert({
      where: { entregaId: params.entregaId },
      create: {
        entregaId: params.entregaId,
        docenteId: params.docenteId,
        fechaCorreccion: params.fechaCorreccion,
        retroalimentacion: params.retroalimentacion ?? null,
      },
      update: {
        fechaCorreccion: params.fechaCorreccion,
        ...(params.retroalimentacion !== undefined
          ? { retroalimentacion: params.retroalimentacion }
          : {}),
      },
    });

    // 2. Eliminar errores previos asociados si existieran
    await tx.errorCorreccion.deleteMany({
      where: { correccionId: correccion.idCorreccion },
    });

    // 3. Persistir errores contables definitivos
    if (params.errores.length > 0) {
      await tx.errorCorreccion.createMany({
        data: params.errores.map((e) => ({
          correccionId: correccion.idCorreccion,
          ejercicioPlantillaId: e.ejercicioPlantillaId,
          tipoError: e.tipoError,
          detalle: e.detalle,
          comentarioDocente: e.comentarioDocente ?? null,
        })),
      });
    }

    // 4. Crear notificación para el alumno
    const mensaje = params.docenteNombre
      ? `Tu entrega para "${params.tituloEjercicio}" ha sido corregida por el docente ${params.docenteNombre}.`
      : `Tu entrega para "${params.tituloEjercicio}" ha sido corregida.`;

    const notificacion = await tx.notificacion.create({
      data: {
        usuarioId: params.alumnoUsuarioId,
        ejercicioId: params.ejercicioId,
        tipo: 'EJERCICIO_CORREGIDO',
        titulo: 'Ejercicio corregido',
        mensaje,
      },
    });

    return {
      correccion,
      totalErroresPersistidos: params.errores.length,
      notificacion,
    };
  });
}

export interface UpsertComentarioErrorData {
  idError?: number | undefined;
  ejercicioPlantillaId: number;
  tipoError: TipoErrorCorreccion;
  detalle: Record<string, unknown>;
  comentario?: string | null | undefined;
}

export async function upsertComentarioError(
  entregaId: number,
  docenteId: string,
  data: UpsertComentarioErrorData,
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  // 1. Asegurar existencia de CorreccionEntrega
  const correccion = await db.correccionEntrega.upsert({
    where: { entregaId },
    create: {
      entregaId,
      docenteId,
    },
    update: {},
    select: { idCorreccion: true },
  });

  const comentarioLimpio = data.comentario?.trim() || null;

  // 2. Si vino idError específico, actualizar directamente
  if (data.idError) {
    const errorExistente = await db.errorCorreccion.findFirst({
      where: {
        idError: data.idError,
        correccionId: correccion.idCorreccion,
      },
    });

    if (errorExistente) {
      return db.errorCorreccion.update({
        where: { idError: errorExistente.idError },
        data: { comentarioDocente: comentarioLimpio },
      });
    }
  }

  // 3. Si no vino idError o no se encontró, buscar por coincidencia en la BD
  const erroresPrevios = await db.errorCorreccion.findMany({
    where: {
      correccionId: correccion.idCorreccion,
      ejercicioPlantillaId: data.ejercicioPlantillaId,
      tipoError: data.tipoError,
    },
  });

  const errorCoincidente = erroresPrevios.find((e) => {
    if (!e.detalle || typeof e.detalle !== 'object') return false;
    const det = e.detalle as Record<string, unknown>;
    if (
      data.detalle.numeroAsiento !== undefined &&
      det.numeroAsiento !== data.detalle.numeroAsiento
    ) {
      return false;
    }
    if (data.detalle.idCuenta !== undefined && det.idCuenta !== data.detalle.idCuenta) {
      return false;
    }
    if (data.detalle.celda !== undefined && det.celda !== data.detalle.celda) {
      return false;
    }
    if (data.detalle.comprobante !== undefined && det.comprobante !== data.detalle.comprobante) {
      return false;
    }
    if (data.detalle.columna !== undefined && det.columna !== data.detalle.columna) {
      return false;
    }
    return true;
  });

  if (errorCoincidente) {
    return db.errorCorreccion.update({
      where: { idError: errorCoincidente.idError },
      data: { comentarioDocente: comentarioLimpio },
    });
  }

  // 4. Si no existía aún en la BD, crearlo
  return db.errorCorreccion.create({
    data: {
      correccionId: correccion.idCorreccion,
      ejercicioPlantillaId: data.ejercicioPlantillaId,
      tipoError: data.tipoError,
      detalle: data.detalle as Prisma.InputJsonValue,
      comentarioDocente: comentarioLimpio,
    },
  });
}
