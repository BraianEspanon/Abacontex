import type { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const tiposCuentaContableSeed: Seed = {
  name: 'Tipos de cuenta contable',

  async run(prisma: PrismaClient) {
    const tipos = [
      {
        nombre: 'ACTIVO',
        abreviatura: 'A',
        descripcion: 'Bienes y derechos de la empresa.',
      },
      {
        nombre: 'PASIVO',
        abreviatura: 'P',
        descripcion: 'Obligaciones y deudas de la empresa.',
      },
      {
        nombre: 'PATRIMONIO_NETO',
        abreviatura: 'PN',
        descripcion:
          'Recursos propios de la empresa, aportes de los propietarios y resultados acumulados.',
      },
      {
        nombre: 'RESULTADO_POSITIVO',
        abreviatura: 'R+',
        descripcion: 'Ingresos y ganancias que generan un resultado positivo para la empresa.',
      },
      {
        nombre: 'RESULTADO_NEGATIVO',
        abreviatura: 'R-',
        descripcion: 'Costos, gastos y pérdidas que generan un resultado negativo para la empresa.',
      },
    ];

    for (const tipo of tipos) {
      await prisma.tipoCuentaContable.upsert({
        where: {
          nombre: tipo.nombre,
        },
        update: {
          abreviatura: tipo.abreviatura,
          descripcion: tipo.descripcion,
        },
        create: tipo,
      });
    }
  },
};
