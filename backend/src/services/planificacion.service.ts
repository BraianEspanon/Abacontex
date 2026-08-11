import { AuthUser } from '../types/express';
import { ESTADOS_PLANIFICACION } from '../constants/estados-planificacion';

import * as planificacionRepository from '../repositories/planificacion.repository';
import * as usuarioRepository from '../repositories/usuario.repository';
import * as cicloLectivoRepository from '../repositories/ciclo-lectivo.repository';
import * as transactionRepository from '../repositories/transaction.repository';
import * as produccionRepository from '../repositories/produccion.repository';

import { ConflictError } from '../errors/conflict.error';
import { BadRequestError } from '../errors/bad-request-error';

import { CrearPlanificacionDTO } from '../validators/planificacion.validator';

export async function crearPlanificacion(user: AuthUser, data: CrearPlanificacionDTO) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError(
      'Debes completar tu registro antes de realizar operaciones sobre producción.'
    );
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  const empresaId = usuario.alumno.empresa.id;

  const cicloLectivo = await cicloLectivoRepository.findActivoOrThrow();

  const planificacionExistente = await planificacionRepository.findByEmpresaAndCiclo(
    usuario.alumno.empresa.id,
    cicloLectivo.id
  );

  if (planificacionExistente) {
    throw new ConflictError(
      'La planificación anual de producción ya fue creada para este ciclo lectivo.'
    );
  }

  if (data.mesInicio > data.mesFin) {
    throw new BadRequestError('El mes de inicio no puede ser posterior al mes de finalización.');
  }

  const cantidadMeses = data.mesFin - data.mesInicio + 1;

  if (data.detalles.length !== cantidadMeses) {
    throw new BadRequestError(
      'Debe existir un detalle de planificación para cada mes seleccionado.',
      { cantidadMeses }
    );
  }

  const meses = data.detalles.map((detalle) => detalle.mes);

  const mesesUnicos = new Set(meses);

  if (mesesUnicos.size !== meses.length) {
    throw new BadRequestError('No se puede repetir un mes dentro de la planificación.');
  }

  for (const mes of meses) {
    if (mes < data.mesInicio || mes > data.mesFin) {
      throw new BadRequestError(
        'Todos los meses de la planificación deben encontrarse dentro del período seleccionado.',
        { mes }
      );
    }
  }

  return transactionRepository.ejecutarTransaccion(async (tx) => {
    const planificacion = await planificacionRepository.create(
      {
        empresaId,
        cicloLectivoId: cicloLectivo.id,
        mesInicio: data.mesInicio,
        mesFin: data.mesFin,
        estado: 'CARGADA',
      },
      tx
    );

    for (const detalle of data.detalles) {
      await planificacionRepository.createDetalle(
        {
          planificacionId: planificacion.idPlanificacion,
          mes: detalle.mes,
          unidadesEstimadas: detalle.unidadesEstimadas ?? null,
        },
        tx
      );
    }

    return planificacionRepository.findByEmpresaAndCiclo(empresaId, cicloLectivo.id, tx);
  });
}

function calcularEstadoMes(
  mes: number,
  mesActual: number
): 'SIN_INICIAR' | 'EN_CURSO' | 'COMPLETADO' {
  if (mes < mesActual) {
    return 'COMPLETADO';
  }

  if (mes === mesActual) {
    return 'EN_CURSO';
  }

  return 'SIN_INICIAR';
}

export async function obtenerPlanificacionAnual(user: AuthUser) {
  // Obtiene el usuario autenticado y valida que pertenezca a una empresa.
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError(
      'Debes completar tu registro antes de realizar operaciones sobre producción.'
    );
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  const empresaId = usuario.alumno.empresa.id;

  // Obtiene el ciclo lectivo actualmente activo.
  const cicloLectivo = await cicloLectivoRepository.findActivoOrThrow();

  // Obtiene la planificación correspondiente a la empresa y al ciclo actual.
  const planificacion = await planificacionRepository.findByEmpresaAndCiclo(
    empresaId,
    cicloLectivo.id
  );

  // Si todavía no existe una planificación, devuelve el estado inicial.
  if (!planificacion) {
    return {
      cicloLectivo: cicloLectivo.año,
      estado: ESTADOS_PLANIFICACION.PENDIENTE,
      mesInicio: null,
      mesFin: null,
      resumen: {
        unidadesEstimadas: 0,
        unidadesProducidas: 0,
        cumplimiento: 0,
      },
      meses: [],
    };
  }

  // Obtiene el estado Finalizada para consultar la producción real.
  const estadoFinalizada = await produccionRepository.findEstadoFinalizada();

  /*
   * Se utiliza el período completo de la planificación para obtener
   * las órdenes finalizadas correspondientes a esos meses.
   */
  const fechaInicio = new Date(cicloLectivo.año, planificacion.mesInicio - 1, 1);
  const fechaFin = new Date(cicloLectivo.año, planificacion.mesFin, 1);

  const produccionFinalizada = await planificacionRepository.findProduccionFinalizadaPorMes(
    empresaId,
    fechaInicio,
    fechaFin,
    estadoFinalizada.idEstado
  );

  // Obtiene el mes actual para determinar el estado dinámico de cada mes.
  const mesActual = new Date().getMonth() + 1;

  // Agrupa la producción real según el mes en que las órdenes finalizaron.
  const produccionPorMes = new Map<number, number>();

  for (const produccion of produccionFinalizada) {
    if (!produccion.fechaInicio) {
      continue;
    }

    const mes = produccion.fechaInicio.getMonth() + 1;

    const unidadesActuales = produccionPorMes.get(mes) ?? 0;

    produccionPorMes.set(mes, unidadesActuales + produccion.orden.cantidad);
  }

  // Calcula las métricas de cada mes de la planificación.
  const meses = planificacion.detalles.map((detalle) => {
    const unidadesEstimadas = detalle.unidadesEstimadas ?? 0;
    const unidadesProducidas = produccionPorMes.get(detalle.mes) ?? 0;

    const cumplimiento = unidadesEstimadas > 0 ? (unidadesProducidas / unidadesEstimadas) * 100 : 0;

    return {
      mes: detalle.mes,
      unidadesEstimadas,
      unidadesProducidas,
      cumplimiento,
      estado: calcularEstadoMes(detalle.mes, mesActual),
    };
  });

  // Calcula las métricas acumuladas de toda la planificación.
  const unidadesEstimadas = meses.reduce((total, mes) => total + mes.unidadesEstimadas, 0);

  const unidadesProducidas = meses.reduce((total, mes) => total + mes.unidadesProducidas, 0);

  const cumplimiento = unidadesEstimadas > 0 ? (unidadesProducidas / unidadesEstimadas) * 100 : 0;

  return {
    cicloLectivo: cicloLectivo.año,
    estado: planificacion.estado,
    mesInicio: planificacion.mesInicio,
    mesFin: planificacion.mesFin,

    resumen: {
      unidadesEstimadas,
      unidadesProducidas,
      cumplimiento,
    },

    meses,
  };
}
