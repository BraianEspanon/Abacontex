import { prisma } from '../lib/prisma';

export async function findBynombre(nombre: string) {
  return prisma.empresa.findUnique({
    where: {
      nombre,
    },
  });
}

export async function update(
  id: number,
  nombre: string,
  actividad: string,
  logoUrl: string | null
) {
  return prisma.empresa.update({
    where: {
      id,
    },
    data: {
      nombre: nombre,
      actividad: actividad,
      logoUrl: logoUrl,
    },
  });
}

export async function create(
  nombre: string,
  actividad: string,
  logoUrl: string | null,
  idCurso: number,
  idCicloLectivo: number,
  idUsuario: string
) {
  return prisma.$transaction(async (tx) => {
    const empresa = await tx.empresa.create({
      data: {
        nombre: nombre,
        actividad: actividad,
        logoUrl: logoUrl ?? null,
        puntos: 0,
        idCurso: idCurso,
        idCicloLectivo: idCicloLectivo,
      },
    });

    await tx.alumno.update({
      where: {
        id: idUsuario,
      },
      data: {
        idEmpresa: empresa.id,
      },
    });

    return empresa;
  });
}
