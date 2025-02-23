import { Server } from 'socket.io';
import { store_message } from './services/message_service';
import { JSONRPCServer } from 'json-rpc-2.0';

export function initialise_websocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket'],
  });

  console.log('Socket.IO server is ready...');

  // Set up json-rpc server
  const rpc_server = new JSONRPCServer();

  // Register sendMessage method
  rpc_server.addMethod(
    'sendMessage',
    async ({ senderId, receiverId, content }) => {
      console.log('RPC message received:', { senderId, receiverId, content });
      // Validate sender and receiver id before storing messages

      // Store the message in db
      const new_message = await store_message({
        senderId,
        receiverId,
        content,
      });

      console.log('Message stored in db: ', new_message);
      console.log(
        'Active rooms before sending message:',
        io.sockets.adapter.rooms
      );
      // Send message to the receivers room
      io.to(`user-${receiverId}`).emit('newMessage', {
        jsonrpc: '2.0',
        params: new_message,
      });
      console.log(`Message sent to user-${receiverId}`);
      return new_message;
    }
  );

  // Register join room method
  rpc_server.addMethod('join', async ({ user_id }) => {
    if (!user_id) {
      console.error('user_id is missing!');
      return {
        jsonrpc: '2.0',
        error: { code: -32700, message: 'user_id is missing!' },
        id: null,
      };
    }

    // Validate user_id before joining the room
    const room_name = `user-${user_id}`;

    io.sockets.sockets.forEach((socket) => {
      socket.join(room_name);
      console.log(`User ${user_id} joined room ${room_name}`);
    });
    console.log('Active rooms after join:', io.sockets.adapter.rooms);
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Message Event
    socket.on('message', async (data) => {
      console.log(`Message received: ${data}`);

      // broadcasting logic
      try {
        const json = JSON.parse(data);

        if (json.jsonrpc == '2.0') {
          const res = await rpc_server.receive(json);
          if (res) {
            socket.emit('rpcResponse', res);
          }
        }
      } catch (e) {
        console.error('Error processing message!', e);
        socket.emit('rpcError', {
          jsonrpc: '2.0',
          error: { code: -32700, message: 'Parse error' },
          id: null,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}
