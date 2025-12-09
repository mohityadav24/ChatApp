import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { initSocket } from './src/services/socketService.js'; 
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js'
import { connectDB } from './src/config/db.js';


dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
origin:"*", 
    credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

// Socket.io Setup
initSocket(server, app);

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);

app.get('/', (req, res) => {
    res.send('Chat API is running.');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});