import { UsuarioActualResponseDTO } from './alu-actual.dto';
import { CandidatoResponseDTO } from './alu-candidato-response.dto';
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

type Candidato = Prisma.AlumnoGetPayload<{
  include: {
    usuario: true;
    rolEmpresa: true;
  };
}>;

export function toCandidatoResponse(alumno: Candidato): CandidatoResponseDTO {
  return {
    id: alumno.id,

    nombre: alumno.usuario.nombre,

    apellido: alumno.usuario.apellido,

    email: alumno.usuario.email,

    fotoPerfilUrl: alumno.usuario.fotoPerfilUrl,

    rolEmpresa: alumno.rolEmpresa
      ? {
          id: alumno.rolEmpresa.idRol,
          nombre: alumno.rolEmpresa.nombreRol,
        }
      : null,
  };
}
