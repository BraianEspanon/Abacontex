import { io, Socket } from 'socket.io-client';
import { config } from '../config';

let socket: Socket | null = null;

export interface NotificacionEvento {
  tipo: string;
  titulo: string;
  mensaje: string;
  data?: unknown;
  createdAt: string | Date;
}

/**
 * Conecta o reutiliza la instancia de Socket.IO autenticándose mediante el token de Keycloak.
 */
export function conectarSocket(token?: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  // Si ya existía una instancia desconectada, limpiarla
  if (socket) {
    socket.disconnect();
  }

  socket = io(config.API_URL, {
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[Socket.IO] Conectado exitosamente al servidor');
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] Desconectado del servidor:', reason);
  });

  socket.on('connect_error', (error) => {
    console.warn('[Socket.IO] Error de conexión:', error.message);
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
 * Desconecta y limpia la instancia del socket (al cerrar sesión o desmontar).
 */
export function desconectarSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
