import { AuthUser } from '../types/express';

import * as usuarioService from './usuario.service';
import * as conciliacionRepository from '../repositories/conciliacion.repository';
import * as movimientoFinancieroRepository from '../repositories/movimiento-financiero.repository';

export async function obtenerResumenConciliacion(user: AuthUser) {
  const usuario = await usuarioService.getAlumnoConEmpresaOrThrow(user);

  const idEmpresa = usuario.alumno.empresa.id;

  const ultimaConciliacion = await conciliacionRepository.findUltimaByEmpresa(idEmpresa);

  const fechaDesde = ultimaConciliacion ? ultimaConciliacion.fecha : undefined;
  const movimientos = await movimientoFinancieroRepository.findPosterioresAFecha(
    idEmpresa,
    fechaDesde
  );

  const saldoBase = ultimaConciliacion ? Number(ultimaConciliacion.saldoContado) : 0;

  let totalIngresos = 0;
  let totalEgresos = 0;

  for (const mov of movimientos) {
    const importe = Number(mov.importe);
    if (mov.categoria.tipoMovimiento.nombre === 'INGRESO') {
      totalIngresos += importe;
    } else {
      totalEgresos += importe;
    }
  }

  const saldoEsperado = saldoBase + totalIngresos - totalEgresos;

  return {
    saldoEsperado,
    movimientosPeriodo: movimientos.length,
    ultimaConciliacion: ultimaConciliacion ? ultimaConciliacion.fecha : null,
  };
}
