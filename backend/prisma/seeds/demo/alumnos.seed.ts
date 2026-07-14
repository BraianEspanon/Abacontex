import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const alumnosSeed: Seed = {
  name: 'Alumnos demo',

  async run(prisma: PrismaClient) {
    const alumno1 = await prisma.usuario.findUnique({
      where: {
        email: 'alumno@mail.com',
      },
    });

    const alumno2 = await prisma.usuario.findUnique({
      where: {
        email: 'martina.lopez@abacontex.com',
      },
    });

    const empresa5to = await prisma.empresa.findUnique({
      where: {
        nombre: 'TechNova',
      },
    });

    const empresa6to = await prisma.empresa.findUnique({
      where: {
        nombre: 'InnovaSoft',
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

    const rolCEO = await prisma.rolesEmpresa.findUnique({
      where: {
        nombreRol: 'CEO',
      },
    });

    const rolCOO = await prisma.rolesEmpresa.findUnique({
      where: {
        nombreRol: 'COO',
      },
    });

    if (
      !alumno1 ||
      !alumno2 ||
      !empresa5to ||
      !empresa6to ||
      !curso5to ||
      !curso6to ||
      !rolCEO ||
      !rolCOO
    ) {
      throw new Error('No existen todas las entidades necesarias para crear los alumnos.');
    }

    await prisma.alumno.upsert({
      where: {
        id: alumno1.id,
      },
      update: {},
      create: {
        id: alumno1.id,
        idCurso: curso5to.idCurso,
        idEmpresa: empresa5to.id,
        idRolEmpresa: rolCEO.idRol,
      },
    });

    await prisma.alumno.upsert({
      where: {
        id: alumno2.id,
      },
      update: {},
      create: {
        id: alumno2.id,
        idCurso: curso6to.idCurso,
        idEmpresa: empresa6to.id,
        idRolEmpresa: rolCOO.idRol,
      },
    });
  },
};
