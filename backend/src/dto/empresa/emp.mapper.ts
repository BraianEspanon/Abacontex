import { Prisma } from '@prisma/client';

import { EmpresaActualResponseDTO } from './emp-actual.dto';
import {
  ActividadPendienteDashboardDTO,
  DesempenoDashboardDTO,
  EmpresaDashboardResponseDTO,
  GraficoEvolucionFinancieraDTO,
  FinanzasDashboardDTO,
  IndicadoresNegocioDashboardDTO,
  InvitacionPendienteDashboardDTO,
  LogrosDashboardDTO,
  RankingDashboardDTO,
} from './emp-dashboard.dto';

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

export interface ToEmpresaDashboardParams {
  empresa: EmpresaConRelaciones;
  idAlumnoActual: string;
  finanzas: FinanzasDashboardDTO;
  graficoEvolucion: GraficoEvolucionFinancieraDTO;
  actividadPendiente: ActividadPendienteDashboardDTO;
  indicadoresNegocio: IndicadoresNegocioDashboardDTO;
  invitacionesPendientes: InvitacionPendienteDashboardDTO[];
  limiteIntegrantes?: number;
  posicionRanking?: number | null;
  totalEmpresas?: number | null;
  puntajeEmpresarial?: number | null;
  desempeno?: DesempenoDashboardDTO | null;
  ranking?: RankingDashboardDTO | null;
  logros?: LogrosDashboardDTO | null;
}

export function toEmpresaDashboardResponse(
  params: ToEmpresaDashboardParams
): EmpresaDashboardResponseDTO {
  const {
    empresa,
    idAlumnoActual,
    finanzas,
    graficoEvolucion,
    actividadPendiente,
    indicadoresNegocio,
    invitacionesPendientes,
    limiteIntegrantes = 7,
    posicionRanking = null,
    totalEmpresas = null,
    puntajeEmpresarial = null,
    desempeno = null,
    ranking = null,
    logros = null,
  } = params;

  return {
    empresa: {
      id: empresa.id,
      nombre: empresa.nombre,
      actividad: empresa.actividad,
      logoUrl: empresa.logoUrl,
      activo: empresa.activo,
      cantidadIntegrantes: empresa.alumnos.length,
      limiteIntegrantes,
      posicionRanking,
      totalEmpresas,
      puntajeEmpresarial,
    },
    finanzas,
    graficoEvolucion,
    actividadPendiente,
    indicadoresNegocio,
    equipo: {
      miembros: empresa.alumnos.map((alumno) => ({
        id: alumno.id,
        nombre: alumno.usuario.nombre,
        apellido: alumno.usuario.apellido,
        email: alumno.usuario.email,
        rolEmpresa: alumno.rolEmpresa
          ? {
              idRol: alumno.rolEmpresa.idRol,
              nombreRol: alumno.rolEmpresa.nombreRol,
            }
          : null,
        esUsuarioActual: alumno.id === idAlumnoActual,
      })),
      invitacionesPendientes,
    },
    desempeno,
    ranking,
    logros,
  };
}
