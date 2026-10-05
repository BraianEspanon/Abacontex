import { io, Socket } from 'socket.io-client';
import { config } from '../config';
import keycloak from './keycloak';

let socket: Socket | null = null;

export interface NotificacionEvento {
  tipo: string;
  titulo: string;
  mensaje: string;
  data?: unknown;
  createdAt: string | Date;
}

/**
 * Conecta o reutiliza la instancia de Socket.IO autenticándose dinámicamente con Keycloak.
 * Utiliza un callback en 'auth' para garantizar que en cada reconexión se envíe el token fresco.
 */
export function conectarSocket(initialToken?: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  // Si ya existía una instancia desconectada, limpiarla antes de crear una nueva
  if (socket) {
    socket.disconnect();
  }

  socket = io(config.API_URL, {
    auth: (cb: (data: { token?: string }) => void) => {
      // Siempre provee el token fresco de Keycloak (o el inicial) en cada intento de conexión
      cb({ token: keycloak.token || initialToken });
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('[Socket.IO] Conectado exitosamente al servidor');
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] Desconectado del servidor:', reason);
  });

  socket.on('connect_error', async (error) => {
    console.warn('[Socket.IO] Error de conexión:', error.message);

    // Si el error fue por token ausente o inválido/expirado, intentar renovar el token con Keycloak
    if (error.message.includes('AUTH_TOKEN')) {
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed && socket) {
          console.log('[Socket.IO] Token de Keycloak renovado exitosamente para reconexión');
          socket.connect();
        }
      } catch (refreshErr) {
        console.error('[Socket.IO] No se pudo renovar el token de Keycloak:', refreshErr);
      }
    }
  });

  return socket;
}

/**
 * Obtiene la instancia activa del socket (o null si aún no se inicializó).
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Desconecta y limpia la instancia del socket (al cerrar sesión o desmontar la app).
 */
export function desconectarSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
