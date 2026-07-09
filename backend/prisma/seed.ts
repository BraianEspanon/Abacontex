import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Iniciando Seed...');

  // =====================================================
  // CICLO LECTIVO
  // =====================================================

  const ciclo2026 = await prisma.cicloLectivo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      año: 2026,
      activo: true,
    },
  });

  // =====================================================
  // CURSOS
  // =====================================================

  const curso5toA = await prisma.curso.upsert({
    where: { nombreCurso: '5to Año A' },
    update: {},
    create: {
      nombreCurso: '5to Año A',
    },
  });

  const curso6toB = await prisma.curso.upsert({
    where: { nombreCurso: '6to Año B' },
    update: {},
    create: {
      nombreCurso: '6to Año B',
    },
  });

  console.log('Cursos creados');

  // =====================================================
  // ROLES DEL SISTEMA
  // =====================================================

  const rolAdmin = await prisma.rolesSistema.upsert({
    where: { nombreRol: 'ADMIN' },
    update: {},
    create: {
      nombreRol: 'ADMIN',
      descripcion: 'Administrador del sistema',
    },
  });

  const rolDocente = await prisma.rolesSistema.upsert({
    where: { nombreRol: 'DOCENTE' },
    update: {},
    create: {
      nombreRol: 'DOCENTE',
      descripcion: 'Profesor',
    },
  });

  const rolAlumno = await prisma.rolesSistema.upsert({
    where: { nombreRol: 'ALUMNO' },
    update: {},
    create: {
      nombreRol: 'ALUMNO',
      descripcion: 'Alumno',
    },
  });

  console.log('Roles del sistema creados');

  // =====================================================
  // ROLES DE EMPRESA
  // =====================================================

  const rolCEO = await prisma.rolesEmpresa.upsert({
    where: { nombreRol: 'CEO' },
    update: {},
    create: {
      nombreRol: 'CEO',
      descripcion: 'Director Ejecutivo',
    },
  });

  const rolCOO = await prisma.rolesEmpresa.upsert({
    where: { nombreRol: 'COO' },
    update: {},
    create: {
      nombreRol: 'COO',
      descripcion: 'Director de Operaciones',
    },
  });

  const rolCFO = await prisma.rolesEmpresa.upsert({
    where: { nombreRol: 'CFO' },
    update: {},
    create: {
      nombreRol: 'CFO',
      descripcion: 'Director Financiero',
    },
  });

  const rolCTO = await prisma.rolesEmpresa.upsert({
    where: { nombreRol: 'CTO' },
    update: {},
    create: {
      nombreRol: 'CTO',
      descripcion: 'Director Tecnológico',
    },
  });

  const rolCCO = await prisma.rolesEmpresa.upsert({
    where: { nombreRol: 'CCO' },
    update: {},
    create: {
      nombreRol: 'CCO',
      descripcion: 'Director de Comunicación',
    },
  });

  const rolCIO = await prisma.rolesEmpresa.upsert({
    where: { nombreRol: 'CIO' },
    update: {},
    create: {
      nombreRol: 'CIO',
      descripcion: 'Director de Sistemas de Información',
    },
  });

  const rolCMO = await prisma.rolesEmpresa.upsert({
    where: { nombreRol: 'CMO' },
    update: {},
    create: {
      nombreRol: 'CMO',
      descripcion: 'Director de Marketing',
    },
  });

  console.log('Roles de empresa creados:', [
    rolCEO.nombreRol,
    rolCOO.nombreRol,
    rolCFO.nombreRol,
    rolCTO.nombreRol,
    rolCCO.nombreRol,
    rolCIO.nombreRol,
    rolCMO.nombreRol,
  ]);

  // =====================================================
  // USUARIOS
  // =====================================================

  await prisma.usuario.upsert({
    where: {
      email: 'admin@abacontex.com',
    },
    update: {},
    create: {
      keycloakId: 'mock-admin',
      email: 'admin@abacontex.com',
      nombre: 'Admin',
      apellido: 'Global',
      rolSistemaId: rolAdmin.idRol,
    },
  });

  const profesor = await prisma.usuario.upsert({
    where: {
      email: 'sergio.quinteros@abacontex.com',
    },
    update: {},
    create: {
      keycloakId: 'mock-profesor',
      email: 'sergio.quinteros@abacontex.com',
      nombre: 'Sergio',
      apellido: 'Quinteros',
      rolSistemaId: rolDocente.idRol,
    },
  });

  const usuarioAlumno1 = await prisma.usuario.upsert({
    where: {
      email: 'nahuel.perez@abacontex.com',
    },
    update: {},
    create: {
      keycloakId: 'mock-alumno-1',
      email: 'nahuel.perez@abacontex.com',
      nombre: 'Nahuel',
      apellido: 'Pérez',
      rolSistemaId: rolAlumno.idRol,
    },
  });

  const usuarioAlumno2 = await prisma.usuario.upsert({
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

  console.log('Usuarios creados');

  // =====================================================
  // PROFESOR -> CURSOS
  // =====================================================

  await prisma.profesorCursos.upsert({
    where: {
      idCurso_idUsuario: {
        idCurso: curso5toA.idCurso,
        idUsuario: profesor.id,
      },
    },
    update: {},
    create: {
      idCurso: curso5toA.idCurso,
      idUsuario: profesor.id,
    },
  });

  await prisma.profesorCursos.upsert({
    where: {
      idCurso_idUsuario: {
        idCurso: curso6toB.idCurso,
        idUsuario: profesor.id,
      },
    },
    update: {},
    create: {
      idCurso: curso6toB.idCurso,
      idUsuario: profesor.id,
    },
  });

  console.log('Profesor asignado a cursos');

  // =====================================================
  // EMPRESAS
  // =====================================================

  const empresa5to = await prisma.empresa.upsert({
    where: {
      nombre: 'TechNova',
    },
    update: {
      actividad: 'Desarrollo y comercialización de soluciones tecnológicas',
      logoUrl: null,
    },
    create: {
      nombre: 'TechNova',
      actividad: 'Desarrollo y comercialización de soluciones tecnológicas',
      logoUrl: null,
      puntos: 0,
      idCurso: curso5toA.idCurso,
      idCicloLectivo: ciclo2026.id,
    },
  });

  const empresa6to = await prisma.empresa.upsert({
    where: {
      nombre: 'InnovaSoft',
    },
    update: {
      actividad: 'Producción y venta de software educativo',
      logoUrl: null,
    },
    create: {
      nombre: 'InnovaSoft',
      actividad: 'Producción y venta de software educativo',
      logoUrl: null,
      puntos: 0,
      idCurso: curso6toB.idCurso,
      idCicloLectivo: ciclo2026.id,
    },
  });

  console.log('Empresas creadas');

  // =====================================================
  // ALUMNOS
  // =====================================================

  await prisma.alumno.upsert({
    where: {
      id: usuarioAlumno1.id,
    },
    update: {},
    create: {
      id: usuarioAlumno1.id,
      idCurso: curso5toA.idCurso,
      idEmpresa: empresa5to.id,
      idRolEmpresa: rolCEO.idRol,
    },
  });

  await prisma.alumno.upsert({
    where: {
      id: usuarioAlumno2.id,
    },
    update: {},
    create: {
      id: usuarioAlumno2.id,
      idCurso: curso6toB.idCurso,
      idEmpresa: empresa6to.id,
      idRolEmpresa: rolCOO.idRol,
    },
  });

  console.log('Alumnos creados');

  await prisma.tipoMovimiento.createMany({
    data: [{ nombre: 'INGRESO' }, { nombre: 'EGRESO' }],
    skipDuplicates: true,
  });

  await prisma.estadoMovimiento.createMany({
    data: [{ nombre: 'REGISTRADO' }, { nombre: 'ANULADO' }],
    skipDuplicates: true,
  });

  await prisma.metodoPago.createMany({
    data: [{ nombre: 'EFECTIVO' }, { nombre: 'TRANSFERENCIA' }, { nombre: 'TARJETA' }],
    skipDuplicates: true,
  });

  const ingreso = await prisma.tipoMovimiento.findUnique({
    where: { nombre: 'INGRESO' },
  });

  const egreso = await prisma.tipoMovimiento.findUnique({
    where: { nombre: 'EGRESO' },
  });

  if (ingreso && egreso) {
    await prisma.categoriaMovimiento.createMany({
      data: [
        { nombre: 'VENTA', idTipoMovimiento: ingreso.idTipoMovimiento },
        { nombre: 'APORTE CAPITAL', idTipoMovimiento: ingreso.idTipoMovimiento },
        { nombre: 'COMPRA INSUMOS', idTipoMovimiento: egreso.idTipoMovimiento },
        { nombre: 'GASTO OPERATIVO', idTipoMovimiento: egreso.idTipoMovimiento },
      ],
      skipDuplicates: true,
    });
  }

  console.log('====================================');
  console.log('Seed ejecutado correctamente');
  console.log('====================================');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
