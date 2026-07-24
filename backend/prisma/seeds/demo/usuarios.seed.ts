import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const usuariosSeed: Seed = {
  name: 'Usuarios demo',

  async run(prisma: PrismaClient) {
    const rolAdmin = await prisma.rolesSistema.findUnique({
      where: {
        nombreRol: 'ADMIN',
      },
    });

    const rolDocente = await prisma.rolesSistema.findUnique({
      where: {
        nombreRol: 'DOCENTE',
      },
    });

    const rolAlumno = await prisma.rolesSistema.findUnique({
      where: {
        nombreRol: 'ALUMNO',
      },
    });

    if (!rolAdmin || !rolDocente || !rolAlumno) {
      throw new Error('No existen los roles del sistema.');
    }

    // ==========================
    // ADMINISTRADOR
    // ==========================

    await prisma.usuario.upsert({
      where: {
        email: 'admin@mail.com',
      },
      update: {
        keycloakId: '21bf6585-de7d-4f06-832c-636c138c3f55',
        nombre: 'admin',
        apellido: 'admin',
        rolSistemaId: rolAdmin.idRol,
      },
      create: {
        keycloakId: '21bf6585-de7d-4f06-832c-636c138c3f55',
        email: 'admin@mail.com',
        nombre: 'admin',
        apellido: 'admin',
        rolSistemaId: rolAdmin.idRol,
      },
    });

    // ==========================
    // DOCENTE
    // ==========================

    await prisma.usuario.upsert({
      where: {
        email: 'docente@mail.com',
      },
      update: {
        keycloakId: 'aa59f67b-570a-4ec6-96f7-bd7d2749a77c',
        nombre: 'docente',
        apellido: 'docente',
        rolSistemaId: rolDocente.idRol,
      },
      create: {
        keycloakId: 'aa59f67b-570a-4ec6-96f7-bd7d2749a77c',
        email: 'docente@mail.com',
        nombre: 'docente',
        apellido: 'docente',
        rolSistemaId: rolDocente.idRol,
      },
    });

    // ==========================
    // ALUMNO PRINCIPAL
    // ==========================

    await prisma.usuario.upsert({
      where: {
        email: 'alumno@mail.com',
      },
      update: {
        keycloakId: '0eb7dc1a-96b8-4d55-a8fd-85b81ad90f85',
        nombre: 'alumno',
        apellido: 'alumno',
        rolSistemaId: rolAlumno.idRol,
      },
      create: {
        keycloakId: '0eb7dc1a-96b8-4d55-a8fd-85b81ad90f85',
        email: 'alumno@mail.com',
        nombre: 'alumno',
        apellido: 'alumno',
        rolSistemaId: rolAlumno.idRol,
      },
    });

    // ==========================
    // ALUMNO 2 CON KEYCLOAK
    // ==========================

    await prisma.usuario.upsert({
      where: {
        email: 'alumno2@mail.com',
      },
      update: {
        keycloakId: 'pendiente-keycloak-alumno2',
        nombre: 'alumno2',
        apellido: 'alumno2',
        rolSistemaId: rolAlumno.idRol,
      },
      create: {
        keycloakId: 'pendiente-keycloak-alumno2',
        email: 'alumno2@mail.com',
        nombre: 'alumno2',
        apellido: 'alumno2',
        rolSistemaId: rolAlumno.idRol,
      },
    });

    // =========================
    // ALUMNOS DEMO
    // =========================

    await prisma.usuario.upsert({
      where: {
        email: 'martina.lopez@abacontex.com',
      },
      update: {
        nombre: 'Martina',
        apellido: 'López',
        rolSistemaId: rolAlumno.idRol,
      },
      create: {
        keycloakId: 'mock-alumno-martina',
        email: 'martina.lopez@abacontex.com',
        nombre: 'Martina',
        apellido: 'López',
        rolSistemaId: rolAlumno.idRol,
      },
    });

    await prisma.usuario.upsert({
      where: {
        email: 'lucas.gomez@abacontex.com',
      },
      update: {
        nombre: 'Lucas',
        apellido: 'Gómez',
        rolSistemaId: rolAlumno.idRol,
      },
      create: {
        keycloakId: 'mock-alumno-lucas',
        email: 'lucas.gomez@abacontex.com',
        nombre: 'Lucas',
        apellido: 'Gómez',
        rolSistemaId: rolAlumno.idRol,
      },
    });

    await prisma.usuario.upsert({
      where: {
        email: 'sofia.romero@abacontex.com',
      },
      update: {
        nombre: 'Sofía',
        apellido: 'Romero',
        rolSistemaId: rolAlumno.idRol,
      },
      create: {
        keycloakId: 'mock-alumno-sofia',
        email: 'sofia.romero@abacontex.com',
        nombre: 'Sofía',
        apellido: 'Romero',
        rolSistemaId: rolAlumno.idRol,
      },

    });await prisma.usuario.upsert({
      where: {
        email: 'anibal.rodriguez@abacontex.com',
      },
      update: {
        nombre: 'Anibal',
        apellido: 'Rodriguez',
        rolSistemaId: rolAlumno.idRol,
      },
      create: {
        keycloakId: 'mock-anibal-rodriguez',
        email: 'anibal.rodriguez@abacontex.com',
        nombre: 'Anibal',
        apellido: 'Rodriguez',
        rolSistemaId: rolAlumno.idRol,
      },
    });

    await prisma.usuario.upsert({
      where: {
        email: 'mateo.sosa@abacontex.com',
      },
      update: {
        nombre: 'Mateo',
        apellido: 'Sosa',
        rolSistemaId: rolAlumno.idRol,
      },
      create: {
        keycloakId: 'mock-alumno-mateo',
        email: 'mateo.sosa@abacontex.com',
        nombre: 'Mateo',
        apellido: 'Sosa',
        rolSistemaId: rolAlumno.idRol,
      },
    });

    console.log('Usuarios demo creados');
  },
};
