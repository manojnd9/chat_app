import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import user_routes from './routes/user_routes';
import message_routes from './routes/message_routes';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

// Add cors and json support
app.use(cors());
app.use(express.json());

// Add api routes
app.use('/users', user_routes);
app.use('/messages', message_routes);

// Create a http server and attach socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
});

console.log('Waiting for WebSocket connections...');
// Test websocket connection
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

app.get('/', (req: Request, res: Response) => {
  res.send('Chat backend is running!');
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
