import { Server } from 'socket.io';
import { store_message } from './services/message_service';
import { JSONRPCServer } from 'json-rpc-2.0';
import { prisma } from './prisma';

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
      try {
        // Store the message in db
        const new_message = await store_message({
          senderId,
          receiverId,
          content,
        });

        console.log('Message stored in db: ', new_message);
        // Send message to the receivers room
        io.to(`user-${receiverId}`).emit('newMessage', {
          jsonrpc: '2.0',
          params: new_message,
        });
        console.log(`Message sent to user-${receiverId}`);
        return new_message;
      } catch (e) {
        console.error(`Validation failed: ${e}`);
        return {
          jsonrpc: '2.0',
          error: { code: -32000, message: e },
          id: null,
        };
      }
    }
  );

  // Register join room method
  rpc_server.addMethod('join', async ({ user_id, socket_id }) => {
    if (!user_id || !socket_id) {
      console.error('Error: user_id or socket_id is missing!');
      return {
        jsonrpc: '2.0',
        error: { code: -32700, message: 'user_id or socket_id is missing!' },
        id: null,
      };
    }

    // Validate user_id before joining the room
    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
      console.error(`Error: User with ID ${user_id} does not exist`);
      return {
        jsonrpc: '2.0',
        error: {
          code: -32700,
          message: `Error: User with ID ${user_id} does not exist`,
        },
        id: null,
      };
    }

    const room_name = `user-${user_id}`;

    // Get socket corresponding to the user
    let userSocket = io.sockets.sockets.get(socket_id);

    if (userSocket) {
      userSocket.join(room_name);
      console.log(
        `User ${user_id} (socket: ${socket_id}) joined room ${room_name}`
      );
    } else {
      console.error(`No active WebSocket found for socket_id ${socket_id}`);
      return {
        jsonrpc: '2.0',
        error: { code: -32000, message: 'User not connected' },
        id: null,
      };
    }

    // console.log('Active rooms after join:', io.sockets.adapter.rooms);
    return {
      jsonrpc: '2.0',
      result: `User ${user_id} joined room ${room_name}`,
    };
  });

  // Socket on connection workflow
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Process input from json-rpc
    socket.on('message', async (data) => {
      console.log(`Message received: ${data}`);

      try {
        const json = JSON.parse(data);

        if (json.jsonrpc == '2.0') {
          // For joining user to room -> inject socket:id of user to the rpc-join-method
          if (json.method === 'join') {
            json.params = { ...json.params, socket_id: socket.id };
            console.log(`Injected socket_id: ${socket.id} into join request`);
          }
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
