import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const alumnosSeed: Seed = {
  name: 'Alumnos demo',

  async run(prisma: PrismaClient) {
    // 1. Buscamos todos los registros base y todos los roles de empresa
    const [
      usuarioAlumno,
      alumno2,
      usuarioMartina,
      usuarioLucas,
      usuarioSofia,
      usuarioAnibal,
      usuarioMateo,
      curso5to,
      curso6to,
      innovaSoft,
      techNova,
      todosLosRoles,
    ] = await Promise.all([
      prisma.usuario.findUnique({ where: { email: 'alumno@mail.com' } }),
      prisma.usuario.findUnique({ where: { email: 'alumno2@mail.com' } }),
      prisma.usuario.findUnique({ where: { email: 'martina.lopez@abacontex.com' } }),
      prisma.usuario.findUnique({ where: { email: 'lucas.gomez@abacontex.com' } }),
      prisma.usuario.findUnique({ where: { email: 'sofia.romero@abacontex.com' } }),
      prisma.usuario.findUnique({ where: { email: 'anibal.rodriguez@abacontex.com' } }),
      prisma.usuario.findUnique({ where: { email: 'mateo.sosa@abacontex.com' } }),

      prisma.curso.findUnique({ where: { nombreCurso: '5to II' } }),
      prisma.curso.findUnique({ where: { nombreCurso: '6to III' } }),

      prisma.empresa.findUnique({ where: { nombre: 'InnovaSoft' } }),
      prisma.empresa.findUnique({ where: { nombre: 'TechNova' } }),

      prisma.rolesEmpresa.findMany(), // Trae todos los roles (CEO, COO, CFO, CTO, CCO, CIO, CMO)
    ]);

    // Validamos que existan las entidades necesarias
    if (
      !usuarioAlumno ||
      !alumno2 ||
      !usuarioMartina ||
      !usuarioLucas ||
      !usuarioSofia ||
      !usuarioAnibal ||
      !usuarioMateo ||
      !curso5to ||
      !curso6to ||
      !innovaSoft ||
      !techNova ||
      todosLosRoles.length === 0
    ) {
      throw new Error(
        'No existen los usuarios, cursos, empresas o roles necesarios para crear los alumnos demo.'
      );
    }

    // 2. Mapeamos los roles por nombre para acceder fácil (ej: rolesMap['CEO'].idRol)
    const rolesMap = Object.fromEntries(todosLosRoles.map((rol) => [rol.nombreRol, rol]));

    // ==========================
    // 5TO II
    // ==========================

    // Usuario principal: sin empresa por ahora xq la idea es que elija CEO y cree la empresa
    await prisma.alumno.upsert({
      where: { id: usuarioAlumno.id },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: null,
      },
      create: {
        id: usuarioAlumno.id,
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: null,
      },
    });

    // Martina
    await prisma.alumno.upsert({
      where: { id: usuarioMartina.id },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolesMap['CCO']?.idRol ?? null,
      },
      create: {
        id: usuarioMartina.id,
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolesMap['CCO']?.idRol ?? null,
      },
    });

    // Lucas
    await prisma.alumno.upsert({
      where: { id: usuarioLucas.id },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolesMap['CTO']?.idRol ?? null,
      },
      create: {
        id: usuarioLucas.id,
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolesMap['CTO']?.idRol ?? null,
      },
    });

    // Sofía: COO
    await prisma.alumno.upsert({
      where: { id: usuarioSofia.id },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolesMap['COO']?.idRol ?? null,
      },
      create: {
        id: usuarioSofia.id,
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolesMap['COO']?.idRol ?? null,
      },
    });

    // Aníbal: CFO en TechNova
    await prisma.alumno.upsert({
      where: { id: usuarioAnibal.id },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolesMap['CEO']?.idRol ?? null,
      },
      create: {
        id: usuarioAnibal.id,
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolesMap['CEO']?.idRol ?? null,
      },
    });

    // ==========================
    // 6TO III
    // ==========================

    // Alumno2: CEO en InnovaSoft
    await prisma.alumno.upsert({
      where: { id: alumno2.id },
      update: {
        idCurso: curso6to.idCurso,
        idEmpresa: innovaSoft.id,
        idRolEmpresa: rolesMap['CEO']?.idRol ?? null,
      },
      create: {
        id: alumno2.id,
        idCurso: curso6to.idCurso,
        idEmpresa: innovaSoft.id,
        idRolEmpresa: rolesMap['CEO']?.idRol ?? null,
      },
    });

    // Mateo: COO en InnovaSoft
    await prisma.alumno.upsert({
      where: { id: usuarioMateo.id },
      update: {
        idCurso: curso6to.idCurso,
        idEmpresa: innovaSoft.id,
        idRolEmpresa: rolesMap['COO']?.idRol ?? null,
      },
      create: {
        id: usuarioMateo.id,
        idCurso: curso6to.idCurso,
        idEmpresa: innovaSoft.id,
        idRolEmpresa: rolesMap['COO']?.idRol ?? null,
      },
    });

    console.log('Alumnos demo creados');
  },
};
