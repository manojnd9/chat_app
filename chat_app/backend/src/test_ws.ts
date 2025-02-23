import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
    transports: ['websocket'], // ✅ Force WebSockets
});

socket.on('connect', () => {
    console.log('✅ Connected to WebSocket Server!');
    socket.emit('testEvent', 'Hello from Terminal!');
});

socket.on('testEvent', (msg: string) => {
    console.log('📩 Received:', msg);
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from server.');
});
