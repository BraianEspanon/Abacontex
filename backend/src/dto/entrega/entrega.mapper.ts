import {
  EjercicioConPlantillasEntity,
  EjercicioDetalleAlumnoEntity,
  EjercicioTableroAlumnoEntity,
  EntregaConResolucionesEntity,
  ResolucionAlumnoPlantillaEntity,
} from '../../repositories/entrega.repository';
import { EstadoEntregaAlumno } from '../../constants/entrega.constants';
import {
  DetalleCorreccionEntregaDTO,
  DetalleEjercicioAlumnoResponseDTO,
  FinalizarEntregaAlumnoResponseDTO,
  GuardarPlantillaAlumnoResponseDTO,
  ItemTableroEntregaDTO,
  ListadoEntregasAlumnoResponseDTO,
  ResolucionAlumnoResponseDTO,
  ResumenTableroEntregasDTO,
} from './entrega.dto';

interface EjercicioConEntregasBase {
  fechaLimite: Date;
  entregas: {
    fechaEntrega: Date | null;
    resoluciones?: { estado: string }[];
    correccion?: { fechaCorreccion: Date | null } | null;
  }[];
}

export function calcularEstadoEntregaAlumno(
  ejercicio: EjercicioConEntregasBase,
  fechaReferencia: Date = new Date()
): EstadoEntregaAlumno {
  const entrega = ejercicio.entregas[0] ?? null;

  // 1. Si el alumno ya entregó la resolución
  if (entrega?.fechaEntrega) {
    if (entrega.correccion?.fechaCorreccion) {
      return 'CORREGIDO';
    }
    return 'ENTREGADO';
  }

  // 2. Si venció la fecha límite sin entregar
  if (fechaReferencia > ejercicio.fechaLimite) {
    return 'VENCIDO';
  }

  // 3. Si tiene avances pero no entregó y no venció
  if (entrega?.resoluciones && entrega.resoluciones.length > 0) {
    const tienePlantillaIniciada = entrega.resoluciones.some(
      (r) => r.estado === 'EN_EDICION' || r.estado === 'COMPLETADA'
    );
    if (tienePlantillaIniciada) {
      return 'EN_PROGRESO';
    }
  }

  // 4. Caso por defecto: no tiene avances o todas en PENDIENTE
  return 'PENDIENTE';
}

export function toItemTableroEntrega(
  ejercicio: EjercicioTableroAlumnoEntity,
  fechaReferencia: Date = new Date()
): ItemTableroEntregaDTO {
  const entrega = ejercicio.entregas[0] ?? null;
  const resoluciones = entrega?.resoluciones ?? [];
  const plantillasCompletadas = resoluciones.filter((r) => r.estado === 'COMPLETADA').length;

  return {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    docente: {
      idDocente: ejercicio.docente.id,
      nombre: ejercicio.docente.nombre,
      apellido: ejercicio.docente.apellido,
    },
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    estado: calcularEstadoEntregaAlumno(ejercicio, fechaReferencia),
    totalPlantillas: ejercicio.plantillas.length,
    plantillasCompletadas,
    fechaEntrega: entrega?.fechaEntrega ? entrega.fechaEntrega.toISOString() : null,
    bloqueado: Boolean(entrega?.fechaEntrega),
    tieneCorreccion: Boolean(entrega?.correccion?.fechaCorreccion),
    createdAt: ejercicio.createdAt.toISOString(),
    updatedAt: ejercicio.updatedAt.toISOString(),
  };
}

export function toListadoEntregasResponse(
  items: ItemTableroEntregaDTO[],
  page: number,
  pageSize: number,
  totalItems: number,
  resumen: ResumenTableroEntregasDTO
): ListadoEntregasAlumnoResponseDTO {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
    resumen,
  };
}

function calcularEstadoCorreccion(
  entrega: EjercicioDetalleAlumnoEntity['entregas'][0] | null
): DetalleCorreccionEntregaDTO | null {
  if (!entrega || !entrega.fechaEntrega) {
    return null;
  }

  const correccion = entrega.correccion;
  if (!correccion) {
    return {
      estado: 'PENDIENTE',
      fechaCorreccion: null,
    };
  }

  if (correccion.fechaCorreccion) {
    return {
      estado: 'CORREGIDO',
      fechaCorreccion: correccion.fechaCorreccion.toISOString(),
    };
  }

  const algunaPlantillaCorregida = correccion.plantillas?.some((p) => p.estado === 'COMPLETADA');

  return {
    estado: algunaPlantillaCorregida ? 'EN_REVISION' : 'PENDIENTE',
    fechaCorreccion: null,
  };
}

export function toDetalleEjercicioAlumnoResponse(
  ejercicio: EjercicioDetalleAlumnoEntity,
  fechaReferencia: Date = new Date()
): DetalleEjercicioAlumnoResponseDTO {
  const entrega = ejercicio.entregas[0] ?? null;
  const resoluciones = entrega?.resoluciones ?? [];

  const plantillas = ejercicio.plantillas.map((p) => {
    const res = resoluciones.find((r) => r.ejercicioPlantillaId === p.idEjercicioPlantilla);
    return {
      idEjercicioPlantilla: p.idEjercicioPlantilla,
      tipo: p.tipo,
      estado: res?.estado ?? 'PENDIENTE',
    };
  });

  const plantillasCompletadas = plantillas.filter((p) => p.estado === 'COMPLETADA').length;

  return {
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    enunciado: ejercicio.enunciado,
    indicaciones: ejercicio.indicaciones,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    estado: calcularEstadoEntregaAlumno(ejercicio, fechaReferencia),
    bloqueado: Boolean(entrega?.fechaEntrega),
    fechaEntrega: entrega?.fechaEntrega ? entrega.fechaEntrega.toISOString() : null,
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
      año: ejercicio.curso.año,
    },
    docente: {
      idDocente: ejercicio.docente.id,
      nombre: ejercicio.docente.nombre,
      apellido: ejercicio.docente.apellido,
    },
    totalPlantillas: ejercicio.plantillas.length,
    plantillasCompletadas,
    plantillas,
    correccion: calcularEstadoCorreccion(entrega),
    createdAt: ejercicio.createdAt.toISOString(),
    updatedAt: ejercicio.updatedAt.toISOString(),
  };
}

export function toResolucionAlumnoResponse(
  ejercicio: EjercicioConPlantillasEntity,
  entrega: EntregaConResolucionesEntity,
  fechaReferencia: Date = new Date()
): ResolucionAlumnoResponseDTO {
  const resoluciones = entrega.resoluciones ?? [];

  const plantillas = ejercicio.plantillas.map((p) => {
    const res = resoluciones.find((r) => r.ejercicioPlantillaId === p.idEjercicioPlantilla);
    return {
      idEjercicioPlantilla: p.idEjercicioPlantilla,
      tipo: p.tipo,
      estado: res?.estado ?? 'PENDIENTE',
      contenido: res?.contenido ?? null,
    };
  });

  return {
    idEntrega: entrega.idEntrega,
    idEjercicio: ejercicio.idEjercicio,
    titulo: ejercicio.titulo,
    enunciado: ejercicio.enunciado,
    fechaLimite: ejercicio.fechaLimite.toISOString(),
    bloqueado: Boolean(entrega.fechaEntrega),
    fechaEntrega: entrega.fechaEntrega ? entrega.fechaEntrega.toISOString() : null,
    estado: calcularEstadoEntregaAlumno(
      {
        fechaLimite: ejercicio.fechaLimite,
        entregas: [
          {
            fechaEntrega: entrega.fechaEntrega,
            resoluciones: entrega.resoluciones,
            correccion: entrega.correccion,
          },
        ],
      },
      fechaReferencia
    ),
    curso: {
      idCurso: ejercicio.curso.idCurso,
      nombreCurso: ejercicio.curso.nombreCurso,
      año: ejercicio.curso.año,
    },
    plantillas,
  };
}

export function toGuardarPlantillaAlumnoResponse(
  resolucion: ResolucionAlumnoPlantillaEntity,
  tipo: string
): GuardarPlantillaAlumnoResponseDTO {
  return {
    idResolucionPlantilla: resolucion.idResolucionPlantilla,
    idEjercicioPlantilla: resolucion.ejercicioPlantillaId,
    tipo,
    estado: resolucion.estado,
    contenido: resolucion.contenido ?? null,
  };
}

export function toFinalizarEntregaAlumnoResponse(
  ejercicio: EjercicioConPlantillasEntity,
  entrega: EntregaConResolucionesEntity
): FinalizarEntregaAlumnoResponseDTO {
  const fechaEntrega = entrega.fechaEntrega ?? new Date();
  const fueraDeTermino = fechaEntrega > ejercicio.fechaLimite;

  return {
    idEntrega: entrega.idEntrega,
    idEjercicio: ejercicio.idEjercicio,
    mensaje: fueraDeTermino
      ? 'Ejercicio entregado exitosamente (fuera de término).'
      : 'Ejercicio entregado exitosamente.',
    estado: 'ENTREGADO',
    bloqueado: true,
    fechaEntrega: fechaEntrega.toISOString(),
    fueraDeTermino,
  };
}
