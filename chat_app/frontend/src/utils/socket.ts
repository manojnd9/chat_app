import { io } from 'socket.io-client';

// Connect to the backend websocket server
const url = 'http://localhost:3000';

const socket = io(url, {
    transports: ['websocket'],
    autoConnect: false,
});

export default socket;
