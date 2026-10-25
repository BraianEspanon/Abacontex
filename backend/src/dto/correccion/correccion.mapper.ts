import {
  EstadoCorreccionAlumno,
  EstadoCorreccionEjercicio,
} from '../../constants/correccion.constants';
import {
  DetalleEjercicioEntregasEntity,
  EjercicioTableroCorreccionEntity,
} from '../../repositories/correccion.repository';
import {
  CabeceraEjercicioEntregasDTO,
  FiltrosEntregasEjercicioDTO,
  ItemAlumnoEntregaDTO,
  ItemTableroCorreccionDTO,
  ListadoEjerciciosACorregirResponseDTO,
  ListadoEntregasEjercicioResponseDTO,
  ResumenTableroCorreccionesDTO,
} from './correccion.dto';

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

const NOMBRES_PLANTILLAS_LEGIBLES: Record<string, string> = {
  LIBRO_DIARIO: 'Libro diario',
  LIBRO_MAYOR: 'Libro mayor',
  LIBRO_IVA: 'Libro IVA',
  HOJA_TRABAJO: 'Hoja de trabajo',
};

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

  const plantillasResueltas =
    entrega.resoluciones.filter((r) => r.estado === 'COMPLETADA').length;

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
