import { AuthUser } from '../types/express';

import * as usuarioRepository from '../repositories/usuario.repository';
import * as alumnoRepository from '../repositories/alumno.repository';
import * as empresaRepository from '../repositories/empresa.repository';
import * as rolEmpresaRepository from '../repositories/rol-empresa.repository';

export async function crearEmpresa(
  user: AuthUser,
  data: {
    nombre: string;
    actividad: string;
    logoUrl?: string | null;
  }
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithRolEmpresa(user.keycloakId);

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  const alumno = usuario.alumno;

  if (!alumno) {
    throw new Error('El usuario no completó el registro');
  }

  if (alumno.idEmpresa) {
    throw new Error('El alumno ya pertenece a una empresa');
  }

  if (alumno.rolEmpresa?.nombreRol !== 'CEO') {
    throw new Error('Solo un Director Ejecutivo puede crear una empresa');
  }

  const empresaExistente = await empresaRepository.findBynombre(data.nombre);

  if (empresaExistente) {
    throw new Error('Ya existe una empresa con ese nombre');
  }

  const empresa = await empresaRepository.create(
    data.nombre,
    data.actividad,
    data.logoUrl ?? null,
    alumno.idCurso,
    1, //CAMBIAR CICLO LECTIVO CUANDO SE IMPLEMENTE REALMENTE
    usuario.id
  );

  return empresa;
}

export async function getEmpresaActual(user: AuthUser) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresaFull(user.keycloakId);

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  if (!usuario.alumno) {
    throw new Error('El usuario no completó el registro');
  }

  if (!usuario.alumno.empresa) {
    throw new Error('El alumno no pertenece a ninguna empresa');
  }

  const empresa = usuario.alumno.empresa;

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

export async function actualizarEmpresa(
  user: AuthUser,
  data: {
    nombre: string;
    actividad: string;
    logoUrl?: string | null;
  }
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithEmpresa(user.keycloakId);

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  if (!usuario.alumno) {
    throw new Error('El usuario no completó el registro');
  }

  if (!usuario.alumno.empresa) {
    throw new Error('El alumno no pertenece a ninguna empresa');
  }

  const empresa = usuario.alumno.empresa;
  if (empresa.nombre !== data.nombre) {
    const empresaExistente = await empresaRepository.findBynombre(data.nombre);

    if (empresaExistente) {
      throw new Error('Ya existe una empresa con ese nombre!!');
    }
  }

  await empresaRepository.update(empresa.id, data.nombre, data.actividad, data.logoUrl ?? null);

  return getEmpresaActual(user);
}

export async function getCandidatos(user: AuthUser, search?: string) {
  const usuario = await usuarioRepository.findByKeycloakIdWithAlumno(user.keycloakId);

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  if (!usuario.alumno) {
    throw new Error('El usuario no completó el registro');
  }

  if (!usuario.alumno.idEmpresa) {
    throw new Error('El alumno no pertenece a una empresa');
  }

  const alumnos = await alumnoRepository.findCandidatos(usuario.alumno.idCurso, usuario.id, search);

  return alumnos.map((alumno) => ({
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
  }));
}

export async function agregarParticipantes(user: AuthUser, participantes: string[]) {
  const ids = [...new Set(participantes)];
  if (new Set(participantes).size !== participantes.length) {
    throw new Error('La lista de participantes contiene elementos duplicados');
  }

  const usuario = await usuarioRepository.findByKeycloakIdWithRolEmpresa(user.keycloakId);

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  if (!usuario.alumno) {
    throw new Error('El usuario no completó el registro');
  }

  if (!usuario.alumno.idEmpresa) {
    throw new Error('El alumno (CEO) no pertenece a una empresa');
  }

  if (usuario.alumno.rolEmpresa?.nombreRol !== 'CEO') {
    throw new Error('Solo un Director Ejecutivo puede agregar participantes');
  }

  const alumnos = await alumnoRepository.findByIds(ids);

  if (alumnos.length !== ids.length) {
    throw new Error('Uno o más alumnos no existen');
  }

  for (const alumno of alumnos) {
    if (alumno.id === usuario.alumno.id) {
      throw new Error('El CEO ya pertenece a la empresa, no debe agregarse a sí mismo');
    }

    if (alumno.idCurso !== usuario.alumno.idCurso) {
      throw new Error('Todos los participantes deben pertenecer al mismo curso');
    }

    if (alumno.idEmpresa) {
      throw new Error('Uno o más alumnos ya pertenecen a una empresa');
    }

    if (alumno.rolEmpresa?.nombreRol === 'CEO') {
      throw new Error('No es posible agregar un Director Ejecutivo a una empresa');
    }
  }

  await alumnoRepository.agregarAEmpresa(ids, usuario.alumno.idEmpresa!);
}

export async function cambiarRolParticipante(
  user: AuthUser,
  idAlumno: string,
  idRolEmpresa: number
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithRolEmpresa(user.keycloakId);

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  if (!usuario.alumno) {
    throw new Error('El usuario no completó el registro');
  }

  if (!usuario.alumno.idEmpresa) {
    throw new Error('El alumno no pertenece a una empresa');
  }

  if (usuario.alumno.rolEmpresa?.nombreRol !== 'CEO') {
    throw new Error('Solo un Director Ejecutivo puede modificar roles');
  }

  const alumno = await alumnoRepository.findByIdWithEmpresaRol(idAlumno);

  if (!alumno) {
    throw new Error('Alumno inexistente');
  }

  if (alumno.idEmpresa !== usuario.alumno.idEmpresa) {
    throw new Error('El alumno no pertenece a la empresa');
  }

  if (alumno.id === usuario.alumno.id) {
    throw new Error('No puede modificar su propio rol');
  }

  if (idRolEmpresa === usuario.alumno.idRolEmpresa) {
    throw new Error('El Director Ejecutivo no puede asignar el rol CEO');
  }

  await alumnoRepository.updateRolEmpresa(alumno.id, idRolEmpresa);
}

export async function modificarRolesEmpresa(
  user: AuthUser,
  idEmpresa: number,
  roles: {
    idAlumno: string;
    idRolEmpresa: number;
  }[]
) {
  const usuario = await usuarioRepository.findByKeycloakIdWithProfesorCursos(user.keycloakId);

  if (!usuario) {
    throw new Error('Usuario inexistente');
  }

  const empresa = await empresaRepository.findByIdWithAlumnos(idEmpresa);

  if (!empresa) {
    throw new Error('Empresa inexistente');
  }

  const dictaCurso = usuario.profesorCursos.some(
    (profesorCurso) => profesorCurso.idCurso === empresa.idCurso
  );

  if (!dictaCurso) {
    throw new Error('El docente no tiene permisos para modificar esta empresa');
  }

  // Deben enviarse todos los integrantes de la empresa
  if (roles.length !== empresa.alumnos.length) {
    throw new Error('Debe enviarse el rol de todos los integrantes de la empresa');
  }

  // No puede haber alumnos repetidos
  const idsRecibidos = roles.map((rol) => rol.idAlumno);

  if (new Set(idsRecibidos).size !== idsRecibidos.length) {
    throw new Error('Hay alumnos repetidos en la solicitud');
  }

  // Todos los alumnos deben pertenecer a la empresa
  const idsEmpresa = empresa.alumnos.map((alumno) => alumno.id);

  for (const idAlumno of idsRecibidos) {
    if (!idsEmpresa.includes(idAlumno)) {
      throw new Error('Se intentó modificar un alumno que no pertenece a la empresa');
    }
  }

  // Verificar que no falte ningún integrante
  for (const idAlumno of idsEmpresa) {
    if (!idsRecibidos.includes(idAlumno)) {
      throw new Error('Debe enviarse el rol de todos los integrantes de la empresa');
    }
  }

  // Validar roles existentes
  const rolesEmpresa = await rolEmpresaRepository.findAll();

  const idsRoles = rolesEmpresa.map((rol) => rol.idRol);

  for (const rol of roles) {
    if (!idsRoles.includes(rol.idRolEmpresa)) {
      throw new Error('Rol de empresa inexistente');
    }
  }

  // Debe quedar exactamente un CEO
  const rolCEO = rolesEmpresa.find((rol) => rol.nombreRol === 'CEO');

  if (!rolCEO) {
    throw new Error('Rol CEO inexistente');
  }

  const cantidadCEO = roles.filter((rol) => rol.idRolEmpresa === rolCEO.idRol).length;

  if (cantidadCEO !== 1) {
    throw new Error('La empresa debe tener exactamente un Director Ejecutivo');
  }

  await alumnoRepository.updateRoles(roles);
}
