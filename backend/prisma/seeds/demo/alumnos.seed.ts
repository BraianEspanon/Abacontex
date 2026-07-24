import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const alumnosSeed: Seed = {
  name: 'Alumnos demo',

  async run(prisma: PrismaClient) {
    const usuarioAlumno = await prisma.usuario.findUnique({
      where: {
        email: 'alumno@mail.com',
      },
    });

    const usuarioMartina = await prisma.usuario.findUnique({
      where: {
        email: 'martina.lopez@abacontex.com',
      },
    });

    const curso5to = await prisma.curso.findUnique({
      where: {
        nombreCurso: '5to II',
      },
    });

    const rolCEO = await prisma.rolesEmpresa.findUnique({
      where: {
        nombreRol: 'CEO',
      },
    });

    if (!usuarioAlumno || !usuarioMartina || !curso5to || !rolCEO) {
      throw new Error(
        'No existen los usuarios, el curso o el rol de empresa necesarios.',
      );
    }

    // ==========================
    // ALUMNO (CEO)
    // ==========================

    await prisma.alumno.upsert({
      where: {
        id: usuarioAlumno.id,
      },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: rolCEO.idRol,
      },
      create: {
        id: usuarioAlumno.id,
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: rolCEO.idRol,
      },
    });

    // ==========================
    // MARTINA
    // ==========================

    await prisma.alumno.upsert({
      where: {
        id: usuarioMartina.id,
      },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: null,
      },
      create: {
        id: usuarioMartina.id,
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: null,
      },
    });

    console.log('Alumnos demo creados');
  },
};