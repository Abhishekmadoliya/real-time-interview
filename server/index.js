const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"]
  }
});

// Store active interview sessions
const activeSessions = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // HR creates a new interview session
  socket.on('create-session', ({ sessionId, hrId }) => {
    activeSessions.set(sessionId, {
      hrId,
      hrSocket: socket.id,
      candidates: new Set()
    });
    socket.join(sessionId);
    socket.emit('session-created', { sessionId });
  });

  // Candidate joins an interview session
  socket.on('join-session', ({ sessionId, candidateId }) => {
    const session = activeSessions.get(sessionId);
    if (session) {
      session.candidates.add(candidateId);
      socket.join(sessionId);
      socket.to(session.hrSocket).emit('candidate-joined', { candidateId });
      socket.emit('joined-session', { sessionId });
    }
  });

  // Handle WebRTC signaling
  socket.on('signal', ({ sessionId, signal, to }) => {
    socket.to(to).emit('signal', {
      from: socket.id,
      signal
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Clean up sessions if HR disconnects
    activeSessions.forEach((session, sessionId) => {
      if (session.hrSocket === socket.id) {
        io.to(sessionId).emit('session-ended');
        activeSessions.delete(sessionId);
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
