import { EstadoCorreccionEjercicio } from '../../constants/correccion.constants';
import { EjercicioTableroCorreccionEntity } from '../../repositories/correccion.repository';
import {
  ItemTableroCorreccionDTO,
  ListadoEjerciciosACorregirResponseDTO,
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
