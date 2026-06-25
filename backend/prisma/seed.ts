import { prisma } from '../src/lib/prisma';
// Cargamos las variables de entorno de forma limpia al inicio, como en el video
import 'dotenv/config';

// Inicializamos el cliente estándar de Prisma
// const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la carga de datos maestros (Seed)...');

  // 1. Crear los Cursos de prueba
  const curso5toA = await prisma.curso.upsert({
    where: { nombreCurso: '5to Año A' },
    update: {},
    create: { nombreCurso: '5to Año A' },
  });

  const curso6toA = await prisma.curso.upsert({
    where: { nombreCurso: '6to Año B' },
    update: {},
    create: { nombreCurso: '6to Año B' },
  });

  console.log('Cursos creados:', [curso5toA.nombreCurso, curso6toA.nombreCurso]);

  // 2. Crear los Roles del Sistema
  const rolDocente = await prisma.rolesSistema.upsert({
    where: { nombreRol: 'DOCENTE' },
    update: {},
    create: { nombreRol: 'DOCENTE', descripcion: 'Personal docente del establecimiento' },
  });

  const rolAlumno = await prisma.rolesSistema.upsert({
    where: { nombreRol: 'ALUMNO' },
    update: {},
    create: { nombreRol: 'ALUMNO', descripcion: 'Estudiante regular matriculado' },
  });
  const rolAdmin = await prisma.rolesSistema.upsert({
    where: { nombreRol: 'ADMIN' },
    update: {},
    create: {
      nombreRol: 'ADMIN',
      descripcion: 'Usuario con permisos de administración del sistema',
    },
  });

  console.log('Roles insertados:', [rolDocente.nombreRol, rolAlumno.nombreRol, rolAdmin.nombreRol]);

  // 3. Crear un Profesor de Prueba (Usuario)
  const profesor = await prisma.usuario.upsert({
    where: { email: 'sergio.quinteros@abacontex.com' },
    update: {},
    create: {
      keycloakId: 'mock-keycloak-profesor-123',
      email: 'sergio.quinteros@abacontex.com',
      nombre: 'Sergio',
      apellido: 'Quinteros',
      rolSistemaId: rolDocente.idRol,
    },
  });

  console.log(`Profesor de prueba creado: ${profesor.nombre} ${profesor.apellido}`);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@abacontex.com' },
    update: {},
    create: {
      keycloakId: 'mock-keycloak-admin-001',
      email: 'admin@abacontex.com',
      nombre: 'Admin',
      apellido: 'Global',
      rolSistemaId: rolAdmin.idRol,
    },
  });

  console.log(`Administrador creado: ${admin.nombre} ${admin.apellido}`);
  // 4. ASIGNARLE MÚLTIPLES CURSOS AL PROFESOR (Tabla Intermedia)
  await prisma.usuarioCursos.upsert({
    where: {
      idCurso_idUsuario: { idCurso: curso5toA.idCurso, idUsuario: profesor.id },
    },
    update: {},
    create: { idCurso: curso5toA.idCurso, idUsuario: profesor.id },
  });

  await prisma.usuarioCursos.upsert({
    where: {
      idCurso_idUsuario: { idCurso: curso6toA.idCurso, idUsuario: profesor.id },
    },
    update: {},
    create: { idCurso: curso6toA.idCurso, idUsuario: profesor.id },
  });

  console.log('Profesor asignado a 5to A y 6to B.');

  // 5. Crear un Alumno de Prueba (Usuario con Rol ALUMNO)
  const alumno = await prisma.usuario.upsert({
    where: { email: 'nahuel.perez@abacontex.com' },
    update: {},
    create: {
      keycloakId: 'mock-keycloak-alumno-456',
      email: 'nahuel.perez@abacontex.com',
      nombre: 'Nahuel',
      apellido: 'Pérez',
      rolSistemaId: rolAlumno.idRol,
    },
  });

  console.log(`Alumno de prueba creado: ${alumno.nombre} ${alumno.apellido}`);

  // 6. ASIGNAR EL ALUMNO A UN SOLO CURSO (Regla de negocio intermedia)
  await prisma.usuarioCursos.upsert({
    where: {
      idCurso_idUsuario: { idCurso: curso5toA.idCurso, idUsuario: alumno.id },
    },
    update: {},
    create: { idCurso: curso5toA.idCurso, idUsuario: alumno.id },
  });

  console.log(`Alumno asignado correctamente a su único curso (${curso5toA.nombreCurso}).`);
  console.log('Base de datos sembrada con éxito ');
}

main()
  .catch(async (e) => {
    console.error('Error ejecutando el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
