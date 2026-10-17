import { EjercicioTableroAlumnoEntity } from '../../repositories/entrega.repository';
import { EstadoEntregaAlumno } from '../../constants/entrega.constants';
import {
  ItemTableroEntregaDTO,
  ListadoEntregasAlumnoResponseDTO,
  ResumenTableroEntregasDTO,
} from './entrega.dto';

export function calcularEstadoEntregaAlumno(
  ejercicio: EjercicioTableroAlumnoEntity,
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
