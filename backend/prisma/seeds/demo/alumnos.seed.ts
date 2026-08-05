import { PrismaClient } from '@prisma/client';

import type { Seed } from '../types';

export const alumnosSeed: Seed = {
  name: 'Alumnos demo',

  async run(prisma: PrismaClient) {
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
      rolCEO,
      rolCFO,
      rolCOO,
    ] = await Promise.all([
      prisma.usuario.findUnique({
        where: {
          email: 'alumno@ipgsanmartin.edu.ar',
        },
      }),

      prisma.usuario.findUnique({
        where: {
          email: 'alumno2@ipgsanmartin.edu.ar',
        },
      }),

      prisma.usuario.findUnique({
        where: {
          email: 'martina.lopez@ipgsanmartin.edu.ar',
        },
      }),

      prisma.usuario.findUnique({
        where: {
          email: 'lucas.gomez@ipgsanmartin.edu.ar',
        },
      }),

      prisma.usuario.findUnique({
        where: {
          email: 'sofia.romero@ipgsanmartin.edu.ar',
        },
      }),

      prisma.usuario.findUnique({
        where: {
          email: 'anibal.rodriguez@ipgsanmartin.edu.ar',
        },
      }),

      prisma.usuario.findUnique({
        where: {
          email: 'mateo.sosa@ipgsanmartin.edu.ar',
        },
      }),

      prisma.curso.findUnique({
        where: {
          nombreCurso: '5to II',
        },
      }),

      prisma.curso.findUnique({
        where: {
          nombreCurso: '6to III',
        },
      }),

      prisma.empresa.findUnique({
        where: {
          nombre: 'InnovaSoft',
        },
      }),

      prisma.empresa.findUnique({
        where: {
          nombre: 'TechNova',
        },
      }),

      prisma.rolesEmpresa.findUnique({
        where: {
          nombreRol: 'CEO',
        },
      }),

      prisma.rolesEmpresa.findUnique({
        where: {
          nombreRol: 'CFO',
        },
      }),

      prisma.rolesEmpresa.findUnique({
        where: {
          nombreRol: 'COO',
        },
      }),
    ]);

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
      !rolCEO ||
      !rolCFO ||
      !rolCOO
    ) {
      throw new Error(
        'No existen los usuarios, cursos, empresa o roles necesarios para crear los alumnos demo.'
      );
    }

    // ==========================
    // 5TO II
    // ==========================

    // Usuario principal: CEO, pero todavía sin empresa.
    await prisma.alumno.upsert({
      where: {
        id: usuarioAlumno.id,
      },
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

    // Martina: disponible para ser agregada a una empresa.
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

    // Lucas: disponible para ser agregado a una empresa.
    await prisma.alumno.upsert({
      where: {
        id: usuarioLucas.id,
      },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: null,
      },
      create: {
        id: usuarioLucas.id,
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: null,
      },
    });

    // Sofía: disponible para ser agregada a una empresa.
    await prisma.alumno.upsert({
      where: {
        id: usuarioSofia.id,
      },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: rolCOO.idRol,
      },
      create: {
        id: usuarioSofia.id,
        idCurso: curso5to.idCurso,
        idEmpresa: null,
        idRolEmpresa: rolCOO.idRol,
      },
    });

    await prisma.alumno.upsert({
      where: {
        id: usuarioAnibal.id,
      },
      update: {
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolCFO.idRol,
      },
      create: {
        id: usuarioAnibal.id,
        idCurso: curso5to.idCurso,
        idEmpresa: techNova.id,
        idRolEmpresa: rolCFO.idRol,
      },
    });

    // ==========================
    // 6TO III
    // ==========================

    // Alumno2: ya pertenece a InnovaSoft y tiene rol CEO.
    await prisma.alumno.upsert({
      where: {
        id: alumno2.id,
      },
      update: {
        idCurso: curso6to.idCurso,
        idEmpresa: innovaSoft.id,
        idRolEmpresa: rolCEO.idRol,
      },
      create: {
        id: alumno2.id,
        idCurso: curso6to.idCurso,
        idEmpresa: innovaSoft.id,
        idRolEmpresa: rolCEO.idRol,
      },
    });

    // Mateo: compañero de alumno2 dentro de InnovaSoft.
    await prisma.alumno.upsert({
      where: {
        id: usuarioMateo.id,
      },
      update: {
        idCurso: curso6to.idCurso,
        idEmpresa: innovaSoft.id,
        idRolEmpresa: rolCOO.idRol,
      },
      create: {
        id: usuarioMateo.id,
        idCurso: curso6to.idCurso,
        idEmpresa: innovaSoft.id,
        idRolEmpresa: rolCOO.idRol,
      },
    });

    console.log('Alumnos demo creados');
  },
};
