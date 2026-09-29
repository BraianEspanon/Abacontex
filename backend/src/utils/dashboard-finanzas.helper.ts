import {
  EvolucionPuntoGraficoDTO,
  FinanzasDashboardDTO,
  GraficoEvolucionFinancieraDTO,
} from '../dto/empresa/emp-dashboard.dto';

export interface MovimientoFinancieroDashboardItem {
  fecha: Date;
  importe: any;
  categoria: {
    tipoMovimiento: {
      nombre: string;
    };
  };
}

export interface MetricasFinancierasResultado {
  finanzas: FinanzasDashboardDTO;
  graficoEvolucion: GraficoEvolucionFinancieraDTO;
  ingresosTotales: number;
  resultadoAcumulado: number;
}

const NOMBRES_MESES = [
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

export function calcularMetricasFinancieras(
  movimientos: MovimientoFinancieroDashboardItem[],
  añoAcademico: number
): MetricasFinancierasResultado {
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
  const añoMesAnterior = mesActual === 0 ? añoAcademico - 1 : añoAcademico;

  let cajaDisponible = 0;
  let ingresosTotales = 0;
  let egresosTotales = 0;

  let ingresosMesActual = 0;
  let egresosMesActual = 0;
  let ingresosMesAnterior = 0;
  let egresosMesAnterior = 0;

  // 1. Serie Último Mes (por días)
  const ultimoDiaMes = new Date(añoAcademico, mesActual + 1, 0).getDate();
  const diasUltimoMes: EvolucionPuntoGraficoDTO[] = [];
  for (let dia = 1; dia <= ultimoDiaMes; dia++) {
    diasUltimoMes.push({
      periodo: `${dia} ${NOMBRES_MESES[mesActual]}`,
      ingresos: 0,
      egresos: 0,
      resultado: 0,
    });
  }

  // 2. Serie Últimos 3 Meses (por mes)
  const tresMesesList: Array<{ año: number; mes: number; label: string }> = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(añoAcademico, mesActual - i, 1);
    tresMesesList.push({
      año: d.getFullYear(),
      mes: d.getMonth(),
      label: NOMBRES_MESES[d.getMonth()] ?? '',
    });
  }
  const puntosTresMeses: EvolucionPuntoGraficoDTO[] = tresMesesList.map((m) => ({
    periodo: m.label,
    ingresos: 0,
    egresos: 0,
    resultado: 0,
  }));

  // 3. Serie Ciclo Lectivo (12 meses)
  const cicloLectivo: EvolucionPuntoGraficoDTO[] = NOMBRES_MESES.map((nombre) => ({
    periodo: nombre,
    ingresos: 0,
    egresos: 0,
    resultado: 0,
  }));

  for (const mov of movimientos) {
    const importe = Number(mov.importe);
    const esIngreso = mov.categoria.tipoMovimiento.nombre === 'INGRESO';
    const movDate = new Date(mov.fecha);
    const movMes = movDate.getMonth();
    const movAño = movDate.getFullYear();

    if (esIngreso) {
      cajaDisponible += importe;
      ingresosTotales += importe;

      if (movAño === añoAcademico && movMes === mesActual) {
        ingresosMesActual += importe;
      } else if (movAño === añoMesAnterior && movMes === mesAnterior) {
        ingresosMesAnterior += importe;
      }
    } else {
      cajaDisponible -= importe;
      egresosTotales += importe;

      if (movAño === añoAcademico && movMes === mesActual) {
        egresosMesActual += importe;
      } else if (movAño === añoMesAnterior && movMes === mesAnterior) {
        egresosMesAnterior += importe;
      }
    }

    // Agrupación Último Mes (días)
    if (movAño === añoAcademico && movMes === mesActual) {
      const dia = movDate.getDate();
      const itemDia = diasUltimoMes[dia - 1];
      if (itemDia) {
        if (esIngreso) itemDia.ingresos += importe;
        else itemDia.egresos += importe;
      }
    }

    // Agrupación Últimos 3 Meses
    const idxTresMeses = tresMesesList.findIndex((m) => m.año === movAño && m.mes === movMes);
    if (idxTresMeses !== -1) {
      const itemTres = puntosTresMeses[idxTresMeses];
      if (itemTres) {
        if (esIngreso) itemTres.ingresos += importe;
        else itemTres.egresos += importe;
      }
    }

    // Agrupación Ciclo Lectivo Completo (meses)
    if (movAño === añoAcademico) {
      const itemCiclo = cicloLectivo[movMes];
      if (itemCiclo) {
        if (esIngreso) itemCiclo.ingresos += importe;
        else itemCiclo.egresos += importe;
      }
    }
  }

  const redondearPuntos = (lista: EvolucionPuntoGraficoDTO[]) => {
    for (const item of lista) {
      item.ingresos = Math.round(item.ingresos * 100) / 100;
      item.egresos = Math.round(item.egresos * 100) / 100;
      item.resultado = Math.round((item.ingresos - item.egresos) * 100) / 100;
    }
  };

  redondearPuntos(diasUltimoMes);
  redondearPuntos(puntosTresMeses);
  redondearPuntos(cicloLectivo);

  const graficoEvolucion: GraficoEvolucionFinancieraDTO = {
    ultimoMes: diasUltimoMes,
    tresMeses: puntosTresMeses,
    cicloLectivo,
  };

  const resultadoAcumulado = ingresosTotales - egresosTotales;
  const resultadoMesActual = ingresosMesActual - egresosMesActual;
  const resultadoMesAnterior = ingresosMesAnterior - egresosMesAnterior;
  const cajaMesAnterior = cajaDisponible - resultadoMesActual;

  const calcularVariacion = (actual: number, anterior: number): number => {
    if (anterior === 0) {
      return actual > 0 ? 100 : 0;
    }
    const variacion = ((actual - anterior) / Math.abs(anterior)) * 100;
    return Math.round(variacion * 10) / 10;
  };

  const variacionCajaPorcentaje = calcularVariacion(cajaDisponible, cajaMesAnterior);
  const variacionIngresosPorcentaje = calcularVariacion(ingresosMesActual, ingresosMesAnterior);
  const variacionEgresosPorcentaje = calcularVariacion(egresosMesActual, egresosMesAnterior);
  const variacionResultadoPorcentaje = calcularVariacion(resultadoMesActual, resultadoMesAnterior);

  return {
    finanzas: {
      cajaDisponible: Math.round(cajaDisponible * 100) / 100,
      variacionCajaPorcentaje,
      ingresosAcumulados: Math.round(ingresosTotales * 100) / 100,
      variacionIngresosPorcentaje,
      egresosAcumulados: Math.round(egresosTotales * 100) / 100,
      variacionEgresosPorcentaje,
      resultadoAcumulado: Math.round(resultadoAcumulado * 100) / 100,
      variacionResultadoPorcentaje,
    },
    graficoEvolucion,
    ingresosTotales,
    resultadoAcumulado,
  };
}
