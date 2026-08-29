import type { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

interface RubroSeed {
  tipoCuenta: string;
  nombre: string;
  descripcion: string;
}

export const rubrosCuentaContableSeed: Seed = {
  name: 'Rubros de cuenta contable',

  async run(prisma: PrismaClient) {
    const rubros: RubroSeed[] = [
      // ACTIVO
      {
        tipoCuenta: 'ACTIVO',
        nombre: 'Disponibilidades',
        descripcion:
          'Bienes de disponibilidad inmediata, como efectivo, bancos y valores de rápida realización.',
      },
      {
        tipoCuenta: 'ACTIVO',
        nombre: 'Inversiones',
        descripcion:
          'Colocaciones realizadas por la empresa con el objetivo de obtener una rentabilidad.',
      },
      {
        tipoCuenta: 'ACTIVO',
        nombre: 'Créditos',
        descripcion: 'Derechos de cobro que posee la empresa frente a clientes u otros terceros.',
      },
      {
        tipoCuenta: 'ACTIVO',
        nombre: 'Otros Créditos',
        descripcion:
          'Derechos de cobro y otros importes a favor de la empresa que no corresponden a créditos comerciales habituales.',
      },
      {
        tipoCuenta: 'ACTIVO',
        nombre: 'Bienes de Cambio',
        descripcion:
          'Bienes destinados a la venta, producción o transformación dentro de la actividad habitual de la empresa.',
      },
      {
        tipoCuenta: 'ACTIVO',
        nombre: 'Bienes de Uso',
        descripcion: 'Bienes duraderos utilizados por la empresa para desarrollar sus actividades.',
      },
      {
        tipoCuenta: 'ACTIVO',
        nombre: 'Bienes Inmateriales',
        descripcion:
          'Activos intangibles que representan derechos o valores económicos para la empresa.',
      },
      {
        tipoCuenta: 'ACTIVO',
        nombre: 'Cargos Diferidos',
        descripcion:
          'Conceptos cuyo reconocimiento como gasto se distribuye a lo largo de más de un período.',
      },

      // PASIVO
      {
        tipoCuenta: 'PASIVO',
        nombre: 'Deudas Comerciales',
        descripcion:
          'Obligaciones originadas principalmente por compras de bienes o servicios vinculadas a la actividad comercial.',
      },
      {
        tipoCuenta: 'PASIVO',
        nombre: 'Deudas Bancarias',
        descripcion: 'Obligaciones de la empresa frente a bancos y otras entidades financieras.',
      },
      {
        tipoCuenta: 'PASIVO',
        nombre: 'Deudas Financieras',
        descripcion:
          'Obligaciones financieras de la empresa, incluyendo aquellas respaldadas por garantías.',
      },
      {
        tipoCuenta: 'PASIVO',
        nombre: 'Otras Deudas',
        descripcion:
          'Obligaciones de la empresa que no corresponden directamente a deudas comerciales, bancarias o financieras.',
      },
      {
        tipoCuenta: 'PASIVO',
        nombre: 'Otros Compromisos Devengados',
        descripcion:
          'Obligaciones ya generadas económicamente aunque todavía no hayan sido pagadas.',
      },
      {
        tipoCuenta: 'PASIVO',
        nombre: 'Previsiones',
        descripcion:
          'Estimaciones de obligaciones futuras cuya existencia o importe puede presentar incertidumbre.',
      },
      {
        tipoCuenta: 'PASIVO',
        nombre: 'Ganancias a Realizar',
        descripcion:
          'Importes cobrados anticipadamente que todavía no corresponde reconocer como ingresos.',
      },

      // PATRIMONIO NETO
      {
        tipoCuenta: 'PATRIMONIO_NETO',
        nombre: 'Capital o Capital Social',
        descripcion: 'Aportes realizados por los propietarios, socios o accionistas de la empresa.',
      },
      {
        tipoCuenta: 'PATRIMONIO_NETO',
        nombre: 'Reservas',
        descripcion:
          'Resultados retenidos por disposición legal, estatutaria o decisión de la empresa.',
      },
      {
        tipoCuenta: 'PATRIMONIO_NETO',
        nombre: 'Resultados Acumulados',
        descripcion:
          'Resultados obtenidos por la empresa en el ejercicio actual o ejercicios anteriores.',
      },

      // RESULTADO POSITIVO
      {
        tipoCuenta: 'RESULTADO_POSITIVO',
        nombre: 'Ventas y Servicios',
        descripcion:
          'Ingresos generados por ventas de bienes o prestación de servicios correspondientes a la actividad habitual.',
      },
      {
        tipoCuenta: 'RESULTADO_POSITIVO',
        nombre: 'Otros Ingresos',
        descripcion:
          'Ingresos positivos originados por operaciones distintas de la actividad principal.',
      },
      {
        tipoCuenta: 'RESULTADO_POSITIVO',
        nombre: 'Ganancias',
        descripcion:
          'Incrementos patrimoniales positivos provenientes de operaciones distintas de las ventas habituales.',
      },

      // RESULTADO NEGATIVO
      {
        tipoCuenta: 'RESULTADO_NEGATIVO',
        nombre: 'Costos de Ventas y Servicios',
        descripcion: 'Costos asociados a los bienes vendidos o servicios prestados por la empresa.',
      },
      {
        tipoCuenta: 'RESULTADO_NEGATIVO',
        nombre: 'Gastos de Comercialización',
        descripcion:
          'Gastos relacionados con actividades de venta, distribución y comercialización.',
      },
      {
        tipoCuenta: 'RESULTADO_NEGATIVO',
        nombre: 'Gastos de Administración',
        descripcion: 'Gastos asociados a las tareas administrativas y de gestión de la empresa.',
      },
      {
        tipoCuenta: 'RESULTADO_NEGATIVO',
        nombre: 'Gastos de Financiación',
        descripcion:
          'Gastos originados por financiamiento, préstamos y operaciones bancarias o financieras.',
      },
      {
        tipoCuenta: 'RESULTADO_NEGATIVO',
        nombre: 'Pérdidas',
        descripcion:
          'Disminuciones patrimoniales derivadas de hechos u operaciones que representan una pérdida.',
      },
    ];

    for (const rubro of rubros) {
      const tipoCuenta = await prisma.tipoCuentaContable.findUnique({
        where: {
          nombre: rubro.tipoCuenta,
        },
        select: {
          idTipoCuenta: true,
        },
      });

      if (!tipoCuenta) {
        throw new Error(`No existe el tipo de cuenta contable "${rubro.tipoCuenta}".`);
      }

      await prisma.rubroCuentaContable.upsert({
        where: {
          idTipoCuenta_nombre: {
            idTipoCuenta: tipoCuenta.idTipoCuenta,
            nombre: rubro.nombre,
          },
        },
        update: {
          descripcion: rubro.descripcion,
          activo: true,
        },
        create: {
          nombre: rubro.nombre,
          descripcion: rubro.descripcion,
          idTipoCuenta: tipoCuenta.idTipoCuenta,
          activo: true,
        },
      });
    }
  },
};
