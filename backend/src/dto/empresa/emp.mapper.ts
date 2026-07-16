import { Prisma } from '@prisma/client';

import { EmpresaActualResponseDTO } from './emp-actual.dto';

type EmpresaConRelaciones = Prisma.EmpresaGetPayload<{
  include: {
    curso: true;
    cicloLectivo: true;
    alumnos: {
      include: {
        usuario: true;
        rolEmpresa: true;
      };
    };
  };
}>;

export function toEmpresaActualResponse(empresa: EmpresaConRelaciones): EmpresaActualResponseDTO {
  return {
    id: empresa.id,
    nombre: empresa.nombre,
    actividad: empresa.actividad,
    logoUrl: empresa.logoUrl,
    puntos: empresa.puntos,

    curso: {
      id: empresa.curso.idCurso,
      nombre: empresa.curso.nombreCurso,
    },

    cicloLectivo: {
      id: empresa.cicloLectivo.id,
      nombre: empresa.cicloLectivo.año,
    },

    integrantes: empresa.alumnos.map((alumno) => ({
      id: alumno.id,

      nombre: alumno.usuario.nombre,

      apellido: alumno.usuario.apellido,

      email: alumno.usuario.email,

      rolEmpresa: alumno.rolEmpresa
        ? {
            id: alumno.rolEmpresa.idRol,
            nombre: alumno.rolEmpresa.nombreRol,
          }
        : null,
    })),
  };
}
