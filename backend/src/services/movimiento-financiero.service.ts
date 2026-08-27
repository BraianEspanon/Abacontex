import { AuthUser } from '../types/express';
import { Prisma } from '@prisma/client';

import {
  RegistrarMovimientoDTO,
  ConsultarHistorialDTO,
  ConsultarGraficoDTO,
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

  const estadoRegistrado = await movimientoFinancieroRepository.findEstadoPendiente();

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

export async function obtenerResumen(user: AuthUser) {
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

  const movimientos = await movimientoFinancieroRepository.findResumen(idEmpresa, añoAcademico);

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

export async function obtenerDatosGrafico(user: AuthUser, query: ConsultarGraficoDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError('El usuario no está asociado a un alumno.');
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('El alumno no está asociado a una empresa.');
  }

  const idEmpresa = usuario.alumno.empresa.id;
  const añoAcademico = usuario.alumno.empresa.cicloLectivo.año;

  const hoy = new Date();
  let fechaInicio: Date;
  let fechaFin: Date;

  if (query.periodo === 'mes') {
    // Mes actual del año académico (usamos el mes calendario de hoy)
    const mesActual = hoy.getMonth();
    fechaInicio = new Date(añoAcademico, mesActual, 1);
    fechaFin = new Date(añoAcademico, mesActual + 1, 0, 23, 59, 59, 999);
  } else if (query.periodo === '6meses') {
    // Últimos 6 meses hasta fin de este mes
    const mesActual = hoy.getMonth();
    fechaFin = new Date(añoAcademico, mesActual + 1, 0, 23, 59, 59, 999);
    fechaInicio = new Date(añoAcademico, mesActual - 5, 1);
  } else {
    // Ciclo completo (del 1 de Enero al 31 de Diciembre)
    fechaInicio = new Date(añoAcademico, 0, 1);
    fechaFin = new Date(añoAcademico, 11, 31, 23, 59, 59, 999);
  }

  const movimientos = await movimientoFinancieroRepository.findMovimientosPorRango(
    idEmpresa,
    fechaInicio,
    fechaFin
  );

  const nombresMeses = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  if (query.periodo === 'mes') {
    // Agrupar por días (del 1 al último día del mes)
    const agrupado: Record<number, { label: string; ingresos: number; egresos: number }> = {};
    const ultimoDia = fechaFin.getDate();

    for (let i = 1; i <= ultimoDia; i++) {
      agrupado[i] = {
        label: `${i} ${nombresMeses[fechaInicio.getMonth()]}`,
        ingresos: 0,
        egresos: 0,
      };
    }

    for (const mov of movimientos) {
      const dia = mov.fecha.getDate();
      const importe = Number(mov.importe);

      if (agrupado[dia]) {
        if (mov.categoria.tipoMovimiento.nombre === 'INGRESO') {
          agrupado[dia].ingresos += importe;
        } else {
          agrupado[dia].egresos += importe;
        }
      }
    }
    return Object.values(agrupado);
  } else {
    // Agrupar por meses y año
    const agrupado = new Map<string, { label: string; ingresos: number; egresos: number }>();

    // Precargar meses en el mapa para que salgan en orden (y los vacíos en 0)
    const current = new Date(fechaInicio);
    while (current <= fechaFin) {
      const yearStr = current.getFullYear().toString().slice(-2);
      const monthIdx = current.getMonth();
      const key = `${current.getFullYear()}-${monthIdx}`;
      const label = `${nombresMeses[monthIdx]} ${yearStr}`;

      agrupado.set(key, { label, ingresos: 0, egresos: 0 });
      current.setMonth(current.getMonth() + 1);
    }

    for (const mov of movimientos) {
      const key = `${mov.fecha.getFullYear()}-${mov.fecha.getMonth()}`;
      const dataMes = agrupado.get(key);
      if (dataMes) {
        const importe = Number(mov.importe);
        if (mov.categoria.tipoMovimiento.nombre === 'INGRESO') dataMes.ingresos += importe;
        else dataMes.egresos += importe;
      }
    }

    return Array.from(agrupado.values());
  }
}
