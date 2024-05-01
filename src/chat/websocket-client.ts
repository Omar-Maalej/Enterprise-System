import { io, Socket } from 'socket.io-client';

const socket: Socket = io('ws://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('message', (message: string) => {
  console.log('Received message from server:', message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
