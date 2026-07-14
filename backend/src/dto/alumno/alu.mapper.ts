import { UsuarioActualResponseDTO } from './alu-actual.dto';
import { Prisma } from '@prisma/client';

type UsuarioConAlumno = Prisma.UsuarioGetPayload<{
  include: {
    alumno: {
      include: {
        curso: true;
        rolEmpresa: true;
        empresa: true;
      };
    };
  };
}>;

export function toAlumnoActualResponse(usuario: UsuarioConAlumno): UsuarioActualResponseDTO {
  if (!usuario.alumno) {
    return {
      registroCompleto: false,

      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      fotoPerfilUrl: usuario.fotoPerfilUrl,

      curso: null,
      rolEmpresa: null,
      empresa: null,
    };
  }

  return {
    registroCompleto: true,

    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    fotoPerfilUrl: usuario.fotoPerfilUrl,

    curso: {
      id: usuario.alumno.curso.idCurso,
      nombre: usuario.alumno.curso.nombreCurso,
    },

    rolEmpresa: usuario.alumno.rolEmpresa
      ? {
          id: usuario.alumno.rolEmpresa.idRol,
          nombre: usuario.alumno.rolEmpresa.nombreRol,
          descripcion: usuario.alumno.rolEmpresa.descripcion,
        }
      : null,

    empresa: usuario.alumno.empresa
      ? {
          id: usuario.alumno.empresa.id,
          nombre: usuario.alumno.empresa.nombre,
        }
      : null,
  };
}
