import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const tiposCuentaContableSeed: Seed = {
  name: 'Tipos de cuenta contable',

  async run(prisma: PrismaClient) {
    await prisma.tipoCuentaContable.createMany({
      data: [
        {
          nombre: 'ACTIVO',
          descripcion: 'Bienes y derechos de la empresa',
        },
        {
          nombre: 'PASIVO',
          descripcion: 'Obligaciones y deudas de la empresa',
        },
        {
          nombre: 'PATRIMONIO_NETO',
          descripcion: 'Recursos propios y aportes de los propietarios',
        },
        {
          nombre: 'RESULTADO_POSITIVO',
          descripcion: 'Ingresos y ganancias obtenidos por la empresa',
        },
        {
          nombre: 'RESULTADO_NEGATIVO',
          descripcion: 'Gastos, costos y pérdidas de la empresa',
        },
      ],
      skipDuplicates: true,
    });
  },
};
