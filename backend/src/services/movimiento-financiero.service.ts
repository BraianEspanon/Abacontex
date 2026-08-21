import { AuthUser } from '../types/express';
import { Prisma } from '@prisma/client';

import {
  RegistrarMovimientoDTO,
  ConsultarHistorialDTO,
} from '../validators/movimiento-financiero.validator';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as metodoPagoRepository from '../repositories/metodo-pago.repository';
import * as movimientoFinancieroRepository from '../repositories/movimiento-financiero.repository';

import { MovimientoFinancieroMapper } from '../dto/finanzas/movimiento-financiero.mapper';

import { ConflictError } from '../errors/conflict.error';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found.error';

export async function obtenerCategoriasAgrupadas() {
  const categorias = await movimientoFinancieroRepository.findAllCategorias();

  const agrupadas = categorias.reduce(
    (acc, categoria) => {
      const tipo = categoria.tipoMovimiento.nombre.toLowerCase();

      if (!acc[tipo]) {
        acc[tipo] = [];
      }

      acc[tipo].push({
        idCategoria: categoria.idCategoria,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      });

      return acc;
    },
    {} as Record<string, Array<{ idCategoria: number; nombre: string; descripcion: string | null }>>
  );

  return agrupadas;
}

export async function registrarMovimiento(user: AuthUser, data: RegistrarMovimientoDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const empresa = usuario.alumno.empresa;
  const añoCurso = empresa.curso.año;
  const añoAcademico = empresa.cicloLectivo.año;

  const fechaIngresada = new Date(data.fecha);
  const hoy = new Date();

  if (fechaIngresada > hoy) {
    throw new BadRequestError('La fecha del movimiento no puede ser en el futuro.');
  }

  if (fechaIngresada.getFullYear() < añoAcademico) {
    throw new BadRequestError(
      `La fecha del movimiento no puede ser anterior al ciclo lectivo actual (${añoAcademico}).`,
      { fechaIngresada }
    );
  }

  const metodoPagoCurso = await metodoPagoRepository.findByIdAndAño(data.idMetodoPago, añoCurso);

  if (!metodoPagoCurso) {
    throw new BadRequestError('El método de pago no es válido para el curso actual.', {
      añoCurso,
      idMetodoPago: data.idMetodoPago,
    });
  }

  const categoria = await movimientoFinancieroRepository.findCategoriaById(data.idCategoria);

  if (!categoria) {
    throw new NotFoundError('La categoría de movimiento no existe.');
  }

  const estadoRegistrado = await movimientoFinancieroRepository.findEstadoRegistrado();

  return movimientoFinancieroRepository.create({
    idEmpresa: empresa.id,
    idUsuario: usuario.id,
    idCategoria: data.idCategoria,
    idMetodoPago: data.idMetodoPago,
    idEstado: estadoRegistrado.idEstado,
    fecha: fechaIngresada,
    concepto: data.concepto,
    importe: new Prisma.Decimal(data.importe),
    observaciones: data.observaciones || null,
    esAutomatico: false,
  });
}

export async function obtenerHistorial(user: AuthUser, query: ConsultarHistorialDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const idEmpresa = usuario.alumno.empresa.id;
  const añoAcademico = usuario.alumno.empresa.cicloLectivo.año;

  let fechaInicio: Date | undefined;
  let fechaFin: Date | undefined;

  // Si envían mes, buscamos en ese mes del año académico actual
  if (query.mes) {
    fechaInicio = new Date(añoAcademico, query.mes - 1, 1);
    fechaFin = new Date(añoAcademico, query.mes, 0, 23, 59, 59, 999);
  }

  const paginacion = await movimientoFinancieroRepository.findHistorial(idEmpresa, {
    fechaInicio,
    fechaFin,
    idTipoMovimiento: query.idTipoMovimiento,
    page: query.page,
    pageSize: query.pageSize,
  });

  const totalPages = Math.ceil(paginacion.total / query.pageSize);

  return {
    items: paginacion.items.map(MovimientoFinancieroMapper.toHistorialDTO),
    page: query.page,
    pageSize: query.pageSize,
    totalItems: paginacion.total,
    totalPages,
  };
}

export async function obtenerTiposMovimiento() {
  return movimientoFinancieroRepository.findTiposMovimiento();
}

export async function obtenerIndicadores(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const idEmpresa = usuario.alumno.empresa.id;
  const añoAcademico = usuario.alumno.empresa.cicloLectivo.año;

  // Calculamos el mes actual basado en la fecha del servidor
  const mesActual = new Date().getMonth();

  const movimientos = await movimientoFinancieroRepository.getResumenIndicadores(
    idEmpresa,
    añoAcademico
  );

  let totalIngresos = 0;
  let totalEgresos = 0;
  let mesActualIngresos = 0;
  let mesActualEgresos = 0;

  for (const mov of movimientos) {
    const importe = Number(mov.importe);
    const esIngreso = mov.categoria.tipoMovimiento.nombre === 'INGRESO';

    if (esIngreso) {
      totalIngresos += importe;
      // Verificamos que sea del mes actual y del año actual
      if (mov.fecha.getMonth() === mesActual && mov.fecha.getFullYear() === añoAcademico) {
        mesActualIngresos += importe;
      }
    } else {
      totalEgresos += importe;
      if (mov.fecha.getMonth() === mesActual && mov.fecha.getFullYear() === añoAcademico) {
        mesActualEgresos += importe;
      }
    }
  }

  return {
    totalIngresos,
    totalEgresos,
    flujoNeto: totalIngresos - totalEgresos,
    mesActual: {
      ingresos: mesActualIngresos,
      egresos: mesActualEgresos,
    },
  };
}
