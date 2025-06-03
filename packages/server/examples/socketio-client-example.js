// Example: Connecting to ClipCraftr server's Socket.io endpoint from a dashboard or bot client
// Requires: npm install socket.io-client

import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  path: '/socket.io',
  transports: ['websocket'],
});

// Listen for real-time updates
socket.on('queueUpdate', (data) => {
  console.log('Queue update:', data);
});
socket.on('clipUpdate', (data) => {
  console.log('Clip update:', data);
});
socket.on('montageUpdate', (data) => {
  console.log('Montage update:', data);
});

// Example: Handle connection/disconnection
socket.on('connect', () => {
  console.log('Connected to server via Socket.io');
});
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
