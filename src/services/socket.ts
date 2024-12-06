// src/services/socket.ts
import { io } from 'socket.io-client';
import { useRoomStore } from '../store/roomStore';
import { Room } from '../types';

const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Set up socket event listeners
socket.on('room-state', (room: Room) => {
  const store = useRoomStore.getState();
  store.setRoom(room);

  // Find the participant matching the socket ID
  const participant = room.participants.find((p) => p.id === socket.id);
  if (participant) {
    store.setCurrentUser(participant);
  }
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

export const emitCreateRoom = (userName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    socket.emit('create-room', userName, (roomId: string) => {
      if (roomId) {
        resolve(roomId);
      } else {
        reject(new Error('Failed to create room'));
      }
    });
  });
};

export const emitJoinRoom = (roomId: string, userName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    socket.emit(
      'join-room',
      { roomId, userName },
      (response: { error?: string; success?: boolean }) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve();
        }
      }
    );
  });
};

export const emitToggleReady = (roomId: string, userId: string) => {
  socket.emit('toggle-ready', { roomId, userId });
};