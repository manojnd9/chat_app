import { Server } from 'socket.io';

export function initialise_websocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket'],
  });

  console.log('Waiting for WebSocket connections...');

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('sendMessage', (msg) => {
      console.log(`Message received: ${msg}`);
      // broadcasting logic
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  console.log('Socket.IO server is ready...');

  return io;
}
