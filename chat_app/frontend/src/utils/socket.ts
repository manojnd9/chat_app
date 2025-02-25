import { io } from 'socket.io-client';
import { BACKEND_URL } from './urls';

// Connect to the backend websocket server
const socket = io(BACKEND_URL, {
    transports: ['websocket'],
    autoConnect: false,
});

export default socket;
