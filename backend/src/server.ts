import 'dotenv/config';
import http from 'http';
import app from './app';
import { initSocketServer } from './socket/socket.server';

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

// Inicializar WebSockets con Socket.IO
initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto: ${PORT}`);
});
