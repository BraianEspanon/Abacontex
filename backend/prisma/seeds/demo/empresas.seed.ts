import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const empresasSeed: Seed = {
  name: 'Empresas demo',

  async run(prisma: PrismaClient) {
    const ciclo2026 = await prisma.cicloLectivo.findUnique({
      where: {
        id: 1,
      },
    });

    const curso5to = await prisma.curso.findUnique({
<<<<<<< HEAD
  where: {
    nombreCurso: '5to II',
  },
});

const curso6to = await prisma.curso.findUnique({
  where: {
    nombreCurso: '6to III',
  },
});
=======
      where: {
        nombreCurso: '5to II',
      },
    });

    const curso6to = await prisma.curso.findUnique({
      where: {
        nombreCurso: '6to III',
      },
    });
>>>>>>> develop

    if (!ciclo2026 || !curso5to || !curso6to) {
      throw new Error('No existen el ciclo lectivo o los cursos.');
    }

    await prisma.empresa.upsert({
      where: {
        nombre: 'TechNova',
      },
      update: {
        actividad: 'Desarrollo y comercialización de soluciones tecnológicas',
        logoUrl: null,
        puntos: 0,
        activo: true,
        idCurso: curso5to.idCurso,
        idCicloLectivo: ciclo2026.id,
      },
      create: {
        nombre: 'TechNova',
        actividad: 'Desarrollo y comercialización de soluciones tecnológicas',
        logoUrl: null,
        puntos: 0,
        activo: true,
        idCurso: curso5to.idCurso,
        idCicloLectivo: ciclo2026.id,
      },
    });

    await prisma.empresa.upsert({
      where: {
        nombre: 'InnovaSoft',
      },
      update: {
        actividad: 'Producción y venta de software educativo',
        logoUrl: null,
        puntos: 0,
        activo: true,
        idCurso: curso6to.idCurso,
        idCicloLectivo: ciclo2026.id,
      },
      create: {
        nombre: 'InnovaSoft',
        actividad: 'Producción y venta de software educativo',
        logoUrl: null,
        puntos: 0,
        activo: true,
        idCurso: curso6to.idCurso,
        idCicloLectivo: ciclo2026.id,
      },
    });
  },
};
