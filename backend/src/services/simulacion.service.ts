import { AuthUser } from '../types/express';

import { simulacionIaService } from '../integrations/simulacion-ia/simulacion-ia.service';
import { instanciarEstructuraParaEmpresa } from '../utils/simulacion.util';

import * as simulacionRepository from '../repositories/simulacion.repository';
import * as cursoRepository from '../repositories/curso.repository';
import * as docenteRepository from '../repositories/docente.repository';
import * as transactionRepository from '../repositories/transaction.repository';

import { CrearSimulacionDTO } from '../validators/simulacion.validator';
import {
  OPCIONES_DIFICULTADES_SIMULACION,
  OPCIONES_DURACIONES_SIMULACION,
  OPCIONES_FLUJOS_EMPRESARIALES,
  OPCIONES_TIPOS_EVENTO_SORPRESA,
} from '../constants/simulacion.constants';
import {
  OpcionesCrearSimulacionResponseDTO,
  SimulacionCreadaResponseDTO,
} from '../dto/simulacion/simulacion.dto';
import { toSimulacionCreadaResponse } from '../dto/simulacion/simulacion.mapper';

import { BadRequestError } from '../errors/bad-request-error';
import { ForbiddenError } from '../errors/forbidden.error';

export async function crearSimulacion(
  user: AuthUser,
  data: CrearSimulacionDTO
): Promise<SimulacionCreadaResponseDTO> {
  // 1. Obtener docente autenticado desde el repository
  const docente = await docenteRepository.findByKeycloakIdOrThrow(user.keycloakId);

  // 2. Validar existencia del curso
  await cursoRepository.findByIdOrThrow(data.cursoId);

  // 3. Validar permisos del docente sobre el curso
  const cursosDocente = await docenteRepository.findCursoIdsByKeycloakId(user.keycloakId);
  if (!cursosDocente.includes(data.cursoId)) {
    throw new ForbiddenError('No tienes permisos sobre el curso especificado.');
  }

  // 4. Validar fecha límite
  const fechaLimite = new Date(data.fechaLimite);
  if (isNaN(fechaLimite.getTime()) || fechaLimite <= new Date()) {
    throw new BadRequestError('La fecha límite debe ser una fecha válida posterior a la actual.');
  }

  // 5. Consultar y validar empresas activas del curso con participantes
  const empresasCurso = await simulacionRepository.findEmpresasActivasConAlumnosYProductos(
    data.cursoId
  );
  const empresasValidas = empresasCurso.filter((e) => e.alumnos && e.alumnos.length > 0);

  if (empresasValidas.length === 0) {
    throw new BadRequestError(
      'El curso no tiene empresas con alumnos asignados para participar en la simulación.'
    );
  }

  // 6. Generar con IA la estructura base del flujo (1 sola llamada)
  const estructuraBase = await simulacionIaService.generarEstructuraParaCurso({
    flujo: data.flujoEmpresarial,
    dificultad: data.dificultad,
    duracion: data.duracion,
    eventosSorpresa: data.eventosSorpresa,
    usarDatosEmpresa: data.usarDatosEmpresa,
    ...(data.tipoEventoSorpresa ? { tipoEventoSorpresa: data.tipoEventoSorpresa } : {}),
  });

  // 7. Persistir simulación e instanciar grafos adaptados para cada empresa (1 transacción)
  const simulacionCreada = await transactionRepository.ejecutarTransaccion(async (tx) => {
    const nuevaSimulacion = await simulacionRepository.createSimulacion(
      {
        docenteId: docente.id,
        cursoId: data.cursoId,
        titulo: estructuraBase.titulo || `Simulación: ${data.flujoEmpresarial}`,
        flujoEmpresarial: data.flujoEmpresarial,
        dificultad: data.dificultad,
        duracion: data.duracion,
        eventosSorpresa: data.eventosSorpresa,
        usarDatosEmpresa: data.usarDatosEmpresa,
        fechaLimite,
      },
      tx
    );

    for (const empresa of empresasValidas) {
      const { estructuraAdaptada, variablesIniciales } = instanciarEstructuraParaEmpresa(
        estructuraBase,
        empresa,
        data.usarDatosEmpresa,
        data.dificultad
      );

      await simulacionRepository.createSimulacionEmpresaConGrafo(
        {
          simulacionId: nuevaSimulacion.idSimulacion,
          empresaId: empresa.id,
          estructura: estructuraAdaptada,
          variablesIniciales,
        },
        tx
      );
    }

    return nuevaSimulacion;
  });

  // 8. Mapear y retornar respuesta DTO desacoplada
  return toSimulacionCreadaResponse(simulacionCreada, empresasValidas.length);
}

export function obtenerOpcionesCrearSimulacion(): OpcionesCrearSimulacionResponseDTO {
  return {
    flujosEmpresariales: OPCIONES_FLUJOS_EMPRESARIALES,
    dificultades: OPCIONES_DIFICULTADES_SIMULACION,
    duraciones: OPCIONES_DURACIONES_SIMULACION,
    tiposEventoSorpresa: OPCIONES_TIPOS_EVENTO_SORPRESA,
  };
}
