import { Server as HttpServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { jwtVerify } from 'jose';
import { JWKS, KEYCLOAK_ISSUER } from '../config/keycloak';
import { findByKeycloakIdWithDetalles } from '../repositories/usuario.repository';

let io: Server | null = null;

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
 * Inicializa la instancia de Socket.IO vinculada al servidor HTTP.
 */
export function initSocketServer(httpServer: HttpServer): Server {
  const options: Partial<ServerOptions> = {
    cors: {
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true,
    },
  };

  io = new Server(httpServer, options);

  io.on('connection', async (socket) => {
    const rawAuthHeader =
      socket.handshake.headers?.authorization || (socket.handshake.headers?.token as string);

    let headerToken: string | undefined;
    if (rawAuthHeader) {
      headerToken = rawAuthHeader.startsWith('Bearer ')
        ? rawAuthHeader.substring(7).trim()
        : rawAuthHeader.trim();
    }

    // Únicamente se acepta por auth payload (Frontend) o por cabeceras HTTP (Postman)
    const token = socket.handshake.auth?.token || headerToken;

    if (!token) {
      console.warn(`[Socket.IO] Conexión rechazada: token ausente (${socket.id})`);
      socket.disconnect();
      return;
    }

    try {
      // 1. Validar el token con Keycloak
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: KEYCLOAK_ISSUER,
      });

      const keycloakId = payload.sub as string;

      // 2. Obtener el usuario y sus relaciones reales desde la BD
      const usuario = await findByKeycloakIdWithDetalles(keycloakId);

      if (!usuario) {
        console.warn(`[Socket.IO] Usuario no encontrado en BD: ${keycloakId}`);
        socket.disconnect();
        return;
      }

      // 3. Unir a sus salas autorizadas automáticamente
      socket.join(`user_${usuario.id}`);

      if (usuario.alumno) {
        if (usuario.alumno.idCurso) {
          socket.join(`curso_${usuario.alumno.idCurso}`);
        }
        if (usuario.alumno.idEmpresa) {
          socket.join(`empresa_${usuario.alumno.idEmpresa}`);
        }
      }

      if (usuario.profesorCursos?.length) {
        for (const pc of usuario.profesorCursos) {
          socket.join(`curso_${pc.idCurso}`);
        }
      }

      console.log(`[Socket.IO] Conectado: ${usuario.nombre} ${usuario.apellido} (${socket.id})`);
    } catch {
      console.warn(`[Socket.IO] Conexión rechazada: token inválido o expirado (${socket.id})`);
      socket.disconnect();
    }
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
