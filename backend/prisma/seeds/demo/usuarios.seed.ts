import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const usuariosSeed: Seed = {
  name: 'Usuarios demo',

  async run(prisma: PrismaClient) {
    const rolAdmin = await prisma.rolesSistema.findUnique({
      where: { nombreRol: 'ADMIN' },
    });

    const rolDocente = await prisma.rolesSistema.findUnique({
      where: { nombreRol: 'DOCENTE' },
    });

    const rolAlumno = await prisma.rolesSistema.findUnique({
      where: { nombreRol: 'ALUMNO' },
    });

    if (!rolAdmin || !rolDocente || !rolAlumno) {
      throw new Error('No existen los roles del sistema.');
    }

    await prisma.usuario.upsert({
      where: {
        email: 'admin@mail.com',
      },
      update: {},
      create: {
        keycloakId: '21bf6585-de7d-4f06-832c-636c138c3f55',
        email: 'admin@mail.com',
        nombre: 'admin',
        apellido: 'admin',
        rolSistemaId: rolAdmin.idRol,
      },
    });

    await prisma.usuario.upsert({
      where: {
        email: 'docente@mail.com',
      },
      update: {},
      create: {
        keycloakId: 'aa59f67b-570a-4ec6-96f7-bd7d2749a77c',
        email: 'docente@mail.com',
        nombre: 'docente',
        apellido: 'docente',
        rolSistemaId: rolDocente.idRol,
      },
    });

    await prisma.usuario.upsert({
      where: {
        email: 'alumno@mail.com',
      },
      update: {},
      create: {
        keycloakId: '0eb7dc1a-96b8-4d55-a8fd-85b81ad90f85',
        email: 'alumno@mail.com',
        nombre: 'alumno',
        apellido: 'alumno',
        rolSistemaId: rolAlumno.idRol,
      },
    });

    await prisma.usuario.upsert({
      where: {
        email: 'martina.lopez@abacontex.com',
      },
      update: {},
      create: {
        keycloakId: 'mock-alumno-2',
        email: 'martina.lopez@abacontex.com',
        nombre: 'Martina',
        apellido: 'López',
        rolSistemaId: rolAlumno.idRol,
      },
    });
  },
};
