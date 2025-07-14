import express from 'express';
import http from 'http'; // ⬅️ New
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io'; // ⬅️ New
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ⬅️ Create HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// ⬇️ Store io instance in app
app.set('io', io);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io handlers
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId); // Join a room for that user
    console.log(`🛎️ User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
