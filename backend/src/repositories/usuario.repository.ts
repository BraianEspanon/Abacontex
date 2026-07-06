import { prisma } from '../lib/prisma';

export async function findByKeycloakIdWithAlumno(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: true,
    },
  });
}

export async function findByKeycloakIdWithRolEmpresa(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: {
        include: {
          rolEmpresa: true,
        },
      },
    },
  });
}

export async function findByKeycloakIdWithEmpresa(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: {
        include: {
          empresa: true,
        },
      },
    },
  });
}

export async function findByKeycloakIdWithEmpresaFull(keycloakId: string) {
  return prisma.usuario.findUnique({
    where: {
      keycloakId,
    },
    include: {
      alumno: {
        include: {
          empresa: {
            include: {
              curso: true,
              cicloLectivo: true,
              alumnos: {
                include: {
                  usuario: true,
                  rolEmpresa: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
