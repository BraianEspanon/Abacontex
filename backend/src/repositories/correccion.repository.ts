import { Prisma } from '@prisma/client';
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
