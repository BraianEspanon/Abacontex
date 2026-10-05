import { Server as HttpServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { jwtVerify } from 'jose';
import { JWKS, KEYCLOAK_ISSUER } from '../config/keycloak';
import { findByKeycloakIdWithDetalles } from '../repositories/usuario.repository';

let io: Server | null = null;

export type UsuarioConDetalles = NonNullable<
  Awaited<ReturnType<typeof findByKeycloakIdWithDetalles>>
>;

export interface SocketData {
  usuario: UsuarioConDetalles;
}

export interface NotificacionNuevoEjercicioPayload {
  idEjercicio: number;
  titulo: string;
  cursoId: number;
  docenteNombre: string;
  fechaLimite: string | Date;
  mensaje: string;
  createdAt: string | Date;
}

export interface NotificacionGenericaPayload {
  tipo: 'EJERCICIO_NUEVO' | 'PEDIDO_NUEVO' | 'ORDEN_PRODUCCION' | 'SISTEMA';
  titulo: string;
  mensaje: string;
  data?: unknown;
  createdAt: string | Date;
}

/**
 * Inicializa la instancia de Socket.IO vinculada al servidor HTTP con middleware de autenticación y CORS restrictivo.
 */
export function initSocketServer(httpServer: HttpServer): Server {
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost'];

  const options: Partial<ServerOptions> = {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true,
    },
  };

  io = new Server(httpServer, options);

  // 1. Middleware de Handshake: valida el token ANTES de aceptar la conexión
  io.use(async (socket, next) => {
    const rawAuthHeader =
      socket.handshake.headers?.authorization || (socket.handshake.headers?.token as string);

    let headerToken: string | undefined;
    if (rawAuthHeader) {
      headerToken = rawAuthHeader.startsWith('Bearer ')
        ? rawAuthHeader.substring(7).trim()
        : rawAuthHeader.trim();
    }

    const token = socket.handshake.auth?.token || headerToken;

    if (!token) {
      return next(new Error('AUTH_TOKEN_MISSING'));
    }

    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: KEYCLOAK_ISSUER,
      });

      const keycloakId = payload.sub as string;
      const usuario = await findByKeycloakIdWithDetalles(keycloakId);

      if (!usuario) {
        return next(new Error('USER_NOT_FOUND'));
      }

      // Almacenamos el usuario autenticado en socket.data para acceso inmediato
      socket.data.usuario = usuario;
      next();
    } catch {
      next(new Error('AUTH_TOKEN_INVALID'));
    }
  });

  // 2. Conexión autorizada: une automáticamente a las salas de negocio correspondientes
  io.on('connection', (socket) => {
    const usuario: UsuarioConDetalles | undefined = socket.data.usuario;

    if (!usuario) {
      socket.disconnect();
      return;
    }

    // Unir a su sala de usuario privada
    socket.join(`user_${usuario.id}`);

    // Si es alumno, unir a las salas de su curso y de su empresa
    if (usuario.alumno) {
      if (usuario.alumno.idCurso) {
        socket.join(`curso_${usuario.alumno.idCurso}`);
      }
      if (usuario.alumno.idEmpresa) {
        socket.join(`empresa_${usuario.alumno.idEmpresa}`);
      }
    }

    // Si es docente, unir a todas las salas de los cursos que dicta
    if (usuario.profesorCursos?.length) {
      for (const pc of usuario.profesorCursos) {
        socket.join(`curso_${pc.idCurso}`);
      }
    }

    console.log(
      `[Socket.IO] Conectado y autenticado: ${usuario.nombre} ${usuario.apellido} (${socket.id})`
    );

    socket.on('disconnect', () => {
      // Desconexión limpia
    });
  });

  return io;
}

/**
 * Retorna la instancia activa del servidor de Socket.IO.
 */
export function getSocketIO(): Server | null {
  return io;
}

/**
 * Emite una notificación a todos los alumnos conectados al curso cuando se crea/publica un ejercicio.
 */
export function notificarNuevoEjercicio(payload: NotificacionNuevoEjercicioPayload): void {
  if (!io) return;

  const room = `curso_${payload.cursoId}`;

  // Evento específico para actualizar listas o vistas de ejercicios
  io.to(room).emit('ejercicio:creado', payload);

  // Evento genérico para la barra de notificaciones / toasts en el frontend
  io.to(room).emit('notificacion:nueva', {
    tipo: 'EJERCICIO_NUEVO',
    titulo: 'Nuevo Ejercicio Publicado',
    mensaje: payload.mensaje,
    data: payload,
    createdAt: payload.createdAt,
  } satisfies NotificacionGenericaPayload);
}

/**
 * Emite una notificación general a una sala de curso.
 */
export function emitirACurso(cursoId: number | string, evento: string, payload: unknown): void {
  if (!io) return;
  io.to(`curso_${cursoId}`).emit(evento, payload);
}

/**
 * Emite una notificación general a una sala de empresa.
 */
export function emitirAEmpresa(empresaId: number | string, evento: string, payload: unknown): void {
  if (!io) return;
  io.to(`empresa_${empresaId}`).emit(evento, payload);
}

/**
 * Emite una notificación privada a un usuario específico.
 */
export function emitirAUsuario(usuarioId: string, evento: string, payload: unknown): void {
  if (!io) return;
  io.to(`user_${usuarioId}`).emit(evento, payload);
}
