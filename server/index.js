// server/index.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { problems as sampleProblems } from './problems.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('create-room', (userName, callback) => {
    const roomId = uuidv4();
    const userId = socket.id; // Use socket.id as userId

    const room = {
      id: roomId,
      participants: [
        {
          id: userId,
          name: userName,
          isReady: false,
          solvedProblems: [],
          score: 0,
        },
      ],
      problems: sampleProblems,
      status: 'waiting',
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit('room-state', room);
    callback(roomId);
  });

  socket.on('join-room', ({ roomId, userName }, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      callback({ error: 'Room not found' });
      return;
    }

    const userId = socket.id; // Use socket.id as userId
    const participant = {
      id: userId,
      name: userName,
      isReady: false,
      solvedProblems: [],
      score: 0,
    };

    room.participants.push(participant);
    socket.join(roomId);
    io.to(roomId).emit('room-state', room);
    callback({ success: true });
  });

  socket.on('toggle-ready', ({ roomId, userId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const participant = room.participants.find((p) => p.id === userId);
    if (participant) {
      participant.isReady = !participant.isReady;

      const allReady = room.participants.every((p) => p.isReady);
      if (allReady && room.status === 'waiting') {
        room.status = 'started';
        room.startTime = Date.now();
        io.to(roomId).emit('room-started');
      }

      io.to(roomId).emit('room-state', room);
    }
  });

  socket.on('submit-solution', ({ roomId, userId, problemId, code }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const participant = room.participants.find((p) => p.id === userId);
    if (!participant) return;

    if (!participant.solvedProblems.includes(problemId)) {
      participant.solvedProblems.push(problemId);
      participant.score += 100;
      io.to(roomId).emit('room-state', room);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    // Optional: Handle participant removal if needed
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});