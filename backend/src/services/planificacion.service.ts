import { AuthUser } from '../types/express';

import * as planificacionRepository from '../repositories/planificacion.repository';
import * as usuarioRepository from '../repositories/usuario.repository';
import * as cicloLectivoRepository from '../repositories/ciclo-lectivo.repository';
import * as transactionRepository from '../repositories/transaction.repository';

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
