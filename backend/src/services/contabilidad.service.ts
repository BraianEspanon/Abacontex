import { AuthUser } from '../types/express';
import {
  CuentaLibroMayorItemDTO,
  TipoSaldoLibroMayor,
  EstadoResultadosResponseDTO,
  CuentaReporteItemDTO,
  TipoResultadoEjercicio,
  BalanceGeneralResponseDTO,
} from '../dto/contabilidad/contabilidad.dto';

import * as usuarioService from './usuario.service';
import * as contabilidadRepository from '../repositories/contabilidad.repository';

export async function obtenerLibroMayor(user: AuthUser): Promise<CuentaLibroMayorItemDTO[]> {
  const usuarioConEmpresa = await usuarioService.getAlumnoConEmpresaOrThrow(user);
  const empresaId = usuarioConEmpresa.alumno.empresa.id;

  const movimientos = await contabilidadRepository.findLibroMayorByEmpresa(empresaId);

  const agruparMap = new Map<
    number,
    {
      cuentaId: number;
      codigo: string;
      nombre: string;
      tipoCuenta: string;
      numeroFolio: number | null;
      totalDebito: number;
      totalCredito: number;
    }
  >();

  for (const m of movimientos) {
    const cuentaId = m.cuentaId;
    let item = agruparMap.get(cuentaId);

    if (!item) {
      item = {
        cuentaId: m.cuenta.idCuenta,
        codigo: m.cuenta.codigo,
        nombre: m.cuenta.nombre,
        tipoCuenta: m.cuenta.rubro.tipoCuenta.nombre,
        numeroFolio: m.cuenta.foliosEmpresa[0]?.numeroFolio ?? null,
        totalDebito: 0,
        totalCredito: 0,
      };
      agruparMap.set(cuentaId, item);
    }

    item.totalDebito += Number(m.debe);
    item.totalCredito += Number(m.haber);
  }

  const cuentas: CuentaLibroMayorItemDTO[] = Array.from(agruparMap.values()).map((c) => {
    const totalDebito = Number(c.totalDebito.toFixed(2));
    const totalCredito = Number(c.totalCredito.toFixed(2));
    const saldo = Number(Math.abs(totalDebito - totalCredito).toFixed(2));

    let tipoSaldo: TipoSaldoLibroMayor = 'SALDADA';
    if (totalDebito > totalCredito) {
      tipoSaldo = 'DEUDOR';
    } else if (totalCredito > totalDebito) {
      tipoSaldo = 'ACREEDOR';
    }

    let esSaldoCorrecto = true;
    let mensajeError: string | null = null;

    const tipoUpper = c.tipoCuenta.toUpperCase();
    if (tipoUpper.includes('ACTIVO') || tipoUpper.includes('EGRESO')) {
      if (tipoSaldo === 'ACREEDOR') {
        esSaldoCorrecto = false;
        mensajeError = 'Las cuentas de Activo y Egreso deben tener saldo deudor.';
      }
    } else if (
      tipoUpper.includes('PASIVO') ||
      tipoUpper.includes('PATRIMONIO') ||
      tipoUpper.includes('INGRESO')
    ) {
      if (tipoSaldo === 'DEUDOR') {
        esSaldoCorrecto = false;
        mensajeError =
          'Las cuentas de Pasivo, Patrimonio Neto e Ingreso deben tener saldo acreedor.';
      }
    }

    return {
      cuentaId: c.cuentaId,
      codigo: c.codigo,
      nombre: c.nombre,
      tipoCuenta: c.tipoCuenta,
      numeroFolio: c.numeroFolio,
      totalDebito,
      totalCredito,
      saldo,
      tipoSaldo,
      esSaldoCorrecto,
      mensajeError,
    };
  });

  cuentas.sort((a, b) => a.codigo.localeCompare(b.codigo));

  return cuentas;
}

export async function obtenerEstadoResultados(
  user: AuthUser
): Promise<EstadoResultadosResponseDTO> {
  const cuentasMayor = await obtenerLibroMayor(user);

  const ingresos: CuentaReporteItemDTO[] = [];
  const egresos: CuentaReporteItemDTO[] = [];

  for (const c of cuentasMayor) {
    const tipoUpper = c.tipoCuenta.toUpperCase();

    if (tipoUpper.includes('INGRESO') || tipoUpper.includes('RESULTADO_POSITIVO')) {
      const saldoNeto = Number((c.totalCredito - c.totalDebito).toFixed(2));
      ingresos.push({
        cuentaId: c.cuentaId,
        codigo: c.codigo,
        nombre: c.nombre,
        saldo: saldoNeto,
      });
    } else if (tipoUpper.includes('EGRESO') || tipoUpper.includes('RESULTADO_NEGATIVO')) {
      const saldoNeto = Number((c.totalDebito - c.totalCredito).toFixed(2));
      egresos.push({
        cuentaId: c.cuentaId,
        codigo: c.codigo,
        nombre: c.nombre,
        saldo: saldoNeto,
      });
    }
  }

  const totalIngresos = Number(ingresos.reduce((acc, c) => acc + c.saldo, 0).toFixed(2));
  const totalEgresos = Number(egresos.reduce((acc, c) => acc + c.saldo, 0).toFixed(2));

  const diff = Number((totalIngresos - totalEgresos).toFixed(2));
  const resultadoEjercicio = Math.abs(diff);

  let tipoResultado: TipoResultadoEjercicio = 'NEUTRO';
  if (diff > 0) {
    tipoResultado = 'GANANCIA';
  } else if (diff < 0) {
    tipoResultado = 'PERDIDA';
  }

  return {
    ingresos,
    egresos,
    totalIngresos,
    totalEgresos,
    resultadoEjercicio,
    tipoResultado,
  };
}

export async function obtenerBalanceGeneral(user: AuthUser): Promise<BalanceGeneralResponseDTO> {
  const cuentasMayor = await obtenerLibroMayor(user);
  const estadoResultados = await obtenerEstadoResultados(user);

  const activos: CuentaReporteItemDTO[] = [];
  const pasivos: CuentaReporteItemDTO[] = [];
  const patrimonioNeto: CuentaReporteItemDTO[] = [];

  for (const c of cuentasMayor) {
    const tipoUpper = c.tipoCuenta.toUpperCase();

    if (tipoUpper.includes('ACTIVO')) {
      const saldoNeto = Number((c.totalDebito - c.totalCredito).toFixed(2));
      activos.push({
        cuentaId: c.cuentaId,
        codigo: c.codigo,
        nombre: c.nombre,
        saldo: saldoNeto,
      });
    } else if (tipoUpper.includes('PASIVO')) {
      const saldoNeto = Number((c.totalCredito - c.totalDebito).toFixed(2));
      pasivos.push({
        cuentaId: c.cuentaId,
        codigo: c.codigo,
        nombre: c.nombre,
        saldo: saldoNeto,
      });
    } else if (tipoUpper.includes('PATRIMONIO_NETO')) {
      const saldoNeto = Number((c.totalCredito - c.totalDebito).toFixed(2));
      patrimonioNeto.push({
        cuentaId: c.cuentaId,
        codigo: c.codigo,
        nombre: c.nombre,
        saldo: saldoNeto,
      });
    }
  }

  const totalActivo = Number(activos.reduce((acc, c) => acc + c.saldo, 0).toFixed(2));
  const totalPasivo = Number(pasivos.reduce((acc, c) => acc + c.saldo, 0).toFixed(2));
  const sumCuentasPN = Number(patrimonioNeto.reduce((acc, c) => acc + c.saldo, 0).toFixed(2));

  let impactoResultado = 0;
  if (estadoResultados.tipoResultado === 'GANANCIA') {
    impactoResultado = estadoResultados.resultadoEjercicio;
  } else if (estadoResultados.tipoResultado === 'PERDIDA') {
    impactoResultado = -estadoResultados.resultadoEjercicio;
  }

  const totalPatrimonioNeto = Number((sumCuentasPN + impactoResultado).toFixed(2));
  const totalPasivoMasPatrimonioNeto = Number((totalPasivo + totalPatrimonioNeto).toFixed(2));

  const esBalanceEquilibrado = totalActivo === totalPasivoMasPatrimonioNeto;
  const mensajeError = esBalanceEquilibrado
    ? null
    : `La ecuación patrimonial no cuadra: Total Activo ($${totalActivo}) no es igual a Pasivo + Patrimonio Neto ($${totalPasivoMasPatrimonioNeto}).`;

  return {
    activos,
    pasivos,
    patrimonioNeto,
    resultadoEjercicio: estadoResultados.resultadoEjercicio,
    tipoResultadoEjercicio: estadoResultados.tipoResultado,
    totalActivo,
    totalPasivo,
    totalPatrimonioNeto,
    totalPasivoMasPatrimonioNeto,
    esBalanceEquilibrado,
    mensajeError,
  };
}
