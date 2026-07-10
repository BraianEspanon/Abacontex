import { prisma } from '../lib/prisma';

export async function crearDocente(
  usuarioKeycloakId: string,
  email: string,
  nombre: string,
  apellido: string,
  rolSistemaId: number,
  cursoIds: number[]
) {
  return prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.create({
      data: {
        keycloakId: usuarioKeycloakId,
        email: email,
        nombre: nombre,
        apellido: apellido,
        rolSistemaId: rolSistemaId,
      },
    });

    await tx.profesorCursos.createMany({
      data: cursoIds.map((idCurso) => ({
        idCurso,
        idUsuario: usuario.id,
      })),
    });

    return usuario;
  });
}
