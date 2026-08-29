import type { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

interface CuentaContableSeedData {
  codigo: string;
  nombre: string;
  tipoCuenta: string;
  rubro: string;
  descripcion: string;
}

export const cuentasContablesSeed: Seed = {
  name: 'Cuentas contables',

  async run(prisma: PrismaClient) {
    const cuentas: CuentaContableSeedData[] = [
      {
        codigo: '1.1.1.1',
        nombre: 'Fondo Fijo',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion:
          'Dinero en efectivo que la empresa separa para pagar gastos pequeños y habituales.',
      },
      {
        codigo: '1.1.1.2',
        nombre: 'Caja',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion:
          'Dinero en efectivo que la empresa tiene disponible para cobrar o realizar pagos.',
      },
      {
        codigo: '1.1.1.3',
        nombre: 'Valores a Depositar',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion:
          'Cheques u otros valores recibidos que la empresa todavía no depositó en el banco.',
      },
      {
        codigo: '1.1.1.4',
        nombre: 'Bancos',
        tipoCuenta: 'ACTIVO',
        rubro: 'Disponibilidades',
        descripcion: 'Dinero que la empresa tiene disponible en sus cuentas bancarias.',
      },

      // ...seguir con todas las filas del documento
    ];

    for (const cuenta of cuentas) {
      const rubro = await prisma.rubroCuentaContable.findFirst({
        where: {
          nombre: cuenta.rubro,
          tipoCuenta: {
            nombre: cuenta.tipoCuenta,
          },
        },
        select: {
          idRubro: true,
        },
      });

      if (!rubro) {
        throw new Error(
          `No existe el rubro "${cuenta.rubro}" para el tipo "${cuenta.tipoCuenta}".`
        );
      }

      await prisma.cuentaContable.upsert({
        where: {
          codigo: cuenta.codigo,
        },
        update: {
          nombre: cuenta.nombre,
          descripcion: cuenta.descripcion,
          idRubro: rubro.idRubro,
          activo: true,
        },
        create: {
          codigo: cuenta.codigo,
          nombre: cuenta.nombre,
          descripcion: cuenta.descripcion,
          idRubro: rubro.idRubro,
          activo: true,
        },
      });
    }
  },
};
