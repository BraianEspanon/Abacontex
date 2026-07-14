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
      where: {
        nombreCurso: '5to Año A',
      },
    });

    const curso6to = await prisma.curso.findUnique({
      where: {
        nombreCurso: '6to Año B',
      },
    });

    if (!ciclo2026 || !curso5to || !curso6to) {
      throw new Error('No existen el ciclo lectivo o los cursos.');
    }

    await prisma.empresa.upsert({
      where: {
        nombre: 'TechNova',
      },
      update: {},
      create: {
        nombre: 'TechNova',
        actividad: 'Desarrollo y comercialización de soluciones tecnológicas',
        logoUrl: null,
        puntos: 0,
        idCurso: curso5to.idCurso,
        idCicloLectivo: ciclo2026.id,
      },
    });

    await prisma.empresa.upsert({
      where: {
        nombre: 'InnovaSoft',
      },
      update: {},
      create: {
        nombre: 'InnovaSoft',
        actividad: 'Producción y venta de software educativo',
        logoUrl: null,
        puntos: 0,
        idCurso: curso6to.idCurso,
        idCicloLectivo: ciclo2026.id,
      },
    });
  },
};
