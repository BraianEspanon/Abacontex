import { AuthUser } from '../types/express';
import { ConflictError } from '../errors/conflict.error';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as empresaDashboardRepository from '../repositories/empresa-dashboard.repository';

import { getAllAsientoStrategies } from './asiento-strategies/asiento-strategy.registry';
import { OperacionPendienteContext } from './asiento-strategies/asiento-strategy.interface';
import { toEmpresaDashboardResponse } from '../dto/empresa/emp.mapper';
import { calcularMetricasFinancieras } from '../utils/dashboard-finanzas.helper';
import { EmpresaDashboardResponseDTO } from '../dto/empresa/emp-dashboard.dto';

export async function obtenerDashboardEmpresa(
  user: AuthUser
): Promise<EmpresaDashboardResponseDTO> {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFullOrThrow(user.keycloakId);

  if (!usuario.alumno) {
    throw new ConflictError(
      'Debes completar tu registro como alumno para acceder al dashboard de tu empresa.'
    );
  }

  if (!usuario.alumno.empresa) {
    throw new ConflictError('No perteneces a ninguna empresa.');
  }

  const empresa = usuario.alumno.empresa;
  const idEmpresa = empresa.id;
  const añoAcademico = empresa.cicloLectivo.año;
  const esSextoAño = empresa.curso.año === 6;

  const [
    movimientos,
    actividadCounts,
    indicadoresCounts,
    invitacionesPendientes,
    asientosContablesPendientes,
  ] = await Promise.all([
    empresaDashboardRepository.findMovimientosFinancierosEmpresa(idEmpresa),
    empresaDashboardRepository.findActividadPendienteCounts(idEmpresa, empresa.idCurso),
    empresaDashboardRepository.findIndicadoresNegocioCounts(idEmpresa),
    empresaDashboardRepository.findInvitacionesPendientesVigentes(idEmpresa),
    obtenerAsientosPendientesCount(idEmpresa, esSextoAño),
  ]);

  const metricasFinancieras = calcularMetricasFinancieras(movimientos, añoAcademico);

  const rentabilidadPorcentaje =
    metricasFinancieras.ingresosTotales > 0
      ? Math.round(
          (metricasFinancieras.resultadoAcumulado / metricasFinancieras.ingresosTotales) * 1000
        ) / 10
      : 0;

  return toEmpresaDashboardResponse({
    empresa,
    idAlumnoActual: usuario.alumno.id,
    finanzas: metricasFinancieras.finanzas,
    graficoEvolucion: metricasFinancieras.graficoEvolucion,
    actividadPendiente: {
      ...actividadCounts,
      asientosContablesPendientes,
    },
    indicadoresNegocio: {
      ventasRealizadas: indicadoresCounts.ventasRegistradas,
      pedidosCompletados: indicadoresCounts.pedidosEntregados,
      pedidosRecibidos: indicadoresCounts.pedidosRecibidos,
      productosStockCritico: indicadoresCounts.productosStockCritico,
      precisionContable: null,
      ordenesCompletadas: indicadoresCounts.ordenesCompletadas,
      ordenesTotales: indicadoresCounts.ordenesTotales,
      rentabilidadPorcentaje,
    },
    invitacionesPendientes,
    limiteIntegrantes: 7,
    desempeno: null,
    ranking: null,
    logros: null,
  });
}

async function obtenerAsientosPendientesCount(
  empresaId: number,
  esSextoAño: boolean
): Promise<number> {
  const ctx: OperacionPendienteContext = {
    empresaId,
    esSextoAño,
  };

  const estrategias = getAllAsientoStrategies();
  const listados = await Promise.all(estrategias.map((e) => e.getPendientes(ctx)));

  return listados.flat().length;
}
