// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import cors from 'cors';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// connectDB()
// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import  connectDB  from "./config/db.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js"
import Message from "./models/message.model.js"
import User from "./models/user.model.js"

const app = express();
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

const server = http.createServer(app);

// SOCKET IO
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Online users list
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // User comes online
  socket.on("user_online", async (userId) => {
    onlineUsers[userId] = socket.id;
    await User.findByIdAndUpdate(userId, { online: true });
    io.emit("online_users", onlineUsers);
  });

  // Typing
  socket.on("typing", (data) => {
    socket.to(onlineUsers[data.receiver]).emit("typing", data.sender);
  });

  // Send message
  socket.on("send_message", async (data) => {
    const { sender, receiver, message } = data;

    // Save to database
    await Message.create({ sender, receiver, message });

    // Send to receiver
    io.to(onlineUsers[receiver]).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
