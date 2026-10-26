import {
  EstadoCorreccionAlumno,
  EstadoCorreccionEjercicio,
  NOMBRES_PLANTILLAS_LEGIBLES,
} from '../../constants/correccion.constants';
import {
  DetalleEjercicioEntregasEntity,
  EjercicioTableroCorreccionEntity,
  EntregaEspacioTrabajoEntity,
} from '../../repositories/correccion.repository';
import {
  CabeceraEjercicioEntregasDTO,
  EspacioTrabajoCorreccionResponseDTO,
  FiltrosEntregasEjercicioDTO,
  ItemAlumnoEntregaDTO,
  ItemTableroCorreccionDTO,
  ListadoEjerciciosACorregirResponseDTO,
  ListadoEntregasEjercicioResponseDTO,
  PlantillaEspacioTrabajoDTO,
  ResumenTableroCorreccionesDTO,
} from './correccion.dto';
import { ResultadoComparacionEntrega } from '../../utils/comparadores-plantillas';

export function toItemTableroCorreccion(
  ejercicio: EjercicioTableroCorreccionEntity
): ItemTableroCorreccionDTO {
  const totalAlumnos = ejercicio.curso._count.alumnos;
  const totalEntregasRecibidas = ejercicio.entregas.length;
  const cantidadSinEntregar = Math.max(0, totalAlumnos - totalEntregasRecibidas);

  const entregasCorregidas = ejercicio.entregas.filter(
    (e) => e.correccion !== null && e.correccion.fechaCorreccion !== null
  ).length;

  const entregasEnCorreccion = ejercicio.entregas.filter(
    (e) => e.correccion !== null && e.correccion.fechaCorreccion === null
  ).length;

  const entregasPendientes = Math.max(
    0,
    totalEntregasRecibidas - entregasCorregidas - entregasEnCorreccion
  );

  let estado: EstadoCorreccionEjercicio = 'PENDIENTE';
  if (totalEntregasRecibidas === 0) {
    estado = 'SIN_ENTREGAS';
  } else if (entregasCorregidas === totalEntregasRecibidas) {
    estado = 'CORREGIDO';
  } else if (entregasEnCorreccion > 0 || entregasCorregidas > 0) {
    estado = 'EN_CORRECCION';
  }

  return {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
      totalAlumnos,
    },
    estado,
    totalEntregasRecibidas,
    cantidadSinEntregar,
    entregasCorregidas,
    entregasEnCorreccion,
    entregasPendientes,
    tieneResolucionDocente: ejercicio.resolucion?.estado === 'RESUELTO',
    createdAt: ejercicio.createdAt.toISOString(),
  };
}

export function toListadoEjerciciosACorregirResponse(
  itemsPaginados: ItemTableroCorreccionDTO[],
  page: number,
  pageSize: number,
  totalItems: number,
  resumen: ResumenTableroCorreccionesDTO
): ListadoEjerciciosACorregirResponseDTO {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return {
    items: itemsPaginados,
    page,
    pageSize,
    totalItems,
    totalPages,
    resumen,
  };
}

export function formatearNombresPlantillas(tipos: string[]): string[] {
  return tipos.map((t) => NOMBRES_PLANTILLAS_LEGIBLES[t] ?? t);
}

export function toItemAlumnoEntrega(
  alumno: DetalleEjercicioEntregasEntity['curso']['alumnos'][number],
  entrega: DetalleEjercicioEntregasEntity['entregas'][number] | undefined,
  fechaLimite: Date,
  totalPlantillas: number
): ItemAlumnoEntregaDTO {
  const nombre = alumno.usuario.nombre;
  const apellido = alumno.usuario.apellido;
  const fotoPerfilUrl = alumno.usuario.fotoPerfilUrl;

  if (!entrega || entrega.fechaEntrega === null) {
    return {
      idAlumno: alumno.id,
      nombre,
      apellido,
      email: alumno.usuario.email,
      fotoPerfilUrl,
      idEntrega: null,
      fechaEntrega: null,
      fueraDeTermino: false,
      estado: 'SIN_ENTREGAR',
      totalPlantillas,
      plantillasResueltas: 0,
      plantillasCorregidas: 0,
      tieneRetroalimentacion: false,
    };
  }

  const plantillasResueltas = entrega.resoluciones.filter((r) => r.estado === 'COMPLETADA').length;

  const plantillasCompletadas =
    entrega.correccion?.plantillas.filter((p) => p.estado === 'COMPLETADA').length ?? 0;

  const tieneRetro = Boolean(entrega.correccion?.retroalimentacion);
  const esCorregida = Boolean(entrega.correccion && entrega.correccion.fechaCorreccion !== null);

  let estado: EstadoCorreccionAlumno = 'PENDIENTE';
  if (esCorregida) {
    estado = 'CORREGIDA';
  } else if (entrega.correccion !== null && (plantillasCompletadas > 0 || tieneRetro)) {
    estado = 'EN_CORRECCION';
  }

  return {
    idAlumno: alumno.id,
    nombre,
    apellido,
    email: alumno.usuario.email,
    fotoPerfilUrl,
    idEntrega: entrega.idEntrega,
    fechaEntrega: entrega.fechaEntrega.toISOString(),
    fueraDeTermino: entrega.fechaEntrega > fechaLimite,
    estado,
    totalPlantillas,
    plantillasResueltas,
    plantillasCorregidas: plantillasCompletadas,
    tieneRetroalimentacion: tieneRetro,
  };
}

export function toListadoEntregasEjercicioResponse(
  itemsPaginados: ItemAlumnoEntregaDTO[],
  page: number,
  pageSize: number,
  totalItems: number,
  ejercicio: CabeceraEjercicioEntregasDTO,
  filtros: FiltrosEntregasEjercicioDTO
): ListadoEntregasEjercicioResponseDTO {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return {
    items: itemsPaginados,
    page,
    pageSize,
    totalItems,
    totalPages,
    ejercicio,
    filtros,
  };
}

export function toEspacioTrabajoCorreccionResponse(
  entrega: EntregaEspacioTrabajoEntity,
  comparacion: ResultadoComparacionEntrega
): EspacioTrabajoCorreccionResponseDTO {
  const plantillasResueltas = entrega.resoluciones.filter((r) => r.estado === 'COMPLETADA').length;

  const totalErrores = comparacion.kpis.totalErrores;
  const puedeSugerirIa = totalErrores >= 3;

  let motivoDeshabilitadoIa: string | null = null;
  if (!puedeSugerirIa) {
    const tieneAlgunaResolucionDocente = entrega.ejercicio.plantillas.some((ep) => {
      const resDoc = entrega.ejercicio.resolucion?.plantillas.find(
        (p) => p.ejercicioPlantillaId === ep.idEjercicioPlantilla
      );
      return resDoc?.contenido !== null && resDoc?.contenido !== undefined;
    });

    if (!tieneAlgunaResolucionDocente) {
      motivoDeshabilitadoIa = 'El ejercicio no cuenta con resolución modelo docente cargada.';
    } else if (totalErrores === 0) {
      motivoDeshabilitadoIa = 'El ejercicio no presenta errores contables detectados.';
    } else {
      motivoDeshabilitadoIa =
        'Se requieren al menos 3 errores detectados para habilitar la sugerencia pedagógica con IA.';
    }
  }

  const plantillas: PlantillaEspacioTrabajoDTO[] = entrega.ejercicio.plantillas.map((ep) => {
    const revision = entrega.correccion?.plantillas.find(
      (p) => p.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );
    const resolucionAlumno = entrega.resoluciones.find(
      (r) => r.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );
    const resolucionDocente = entrega.ejercicio.resolucion?.plantillas.find(
      (p) => p.ejercicioPlantillaId === ep.idEjercicioPlantilla
    );

    return {
      idEjercicioPlantilla: ep.idEjercicioPlantilla,
      tipo: ep.tipo,
      nombre: NOMBRES_PLANTILLAS_LEGIBLES[ep.tipo] ?? ep.tipo,
      estadoRevision: revision?.estado === 'COMPLETADA' ? 'CORREGIDA' : 'PENDIENTE',
      estadoAlumno: resolucionAlumno?.estado ?? 'PENDIENTE',
      contenidoAlumno: resolucionAlumno?.contenido ?? null,
      contenidoDocente: resolucionDocente?.contenido ?? null,
      errores: comparacion.erroresPorPlantilla.get(ep.idEjercicioPlantilla) ?? [],
    };
  });

  return {
    alumno: {
      idAlumno: entrega.alumno.id,
      nombre: entrega.alumno.usuario.nombre,
      apellido: entrega.alumno.usuario.apellido,
      email: entrega.alumno.usuario.email,
      fotoPerfilUrl: entrega.alumno.usuario.fotoPerfilUrl,
      curso: {
        idCurso: entrega.alumno.curso.idCurso,
        nombreCurso: entrega.alumno.curso.nombreCurso,
      },
    },
    entrega: {
      idEntrega: entrega.idEntrega,
      fechaEntrega: entrega.fechaEntrega ? entrega.fechaEntrega.toISOString() : null,
      fueraDeTermino: entrega.fechaEntrega
        ? entrega.fechaEntrega > entrega.ejercicio.fechaLimite
        : false,
    },
    ejercicio: {
      idEjercicio: entrega.ejercicio.idEjercicio,
      titulo: entrega.ejercicio.titulo,
      enunciado: entrega.ejercicio.enunciado,
      indicaciones: entrega.ejercicio.indicaciones,
      fechaLimite: entrega.ejercicio.fechaLimite.toISOString(),
      totalPlantillas: entrega.ejercicio.plantillas.length,
      plantillasResueltas,
      tieneResolucionDocente: entrega.ejercicio.resolucion?.estado === 'RESUELTO',
    },
    kpis: comparacion.kpis,
    controlIa: {
      puedeSugerirIa,
      motivoDeshabilitadoIa,
    },
    retroalimentacionBorrador: entrega.correccion?.retroalimentacion ?? null,
    plantillas,
  };
}
