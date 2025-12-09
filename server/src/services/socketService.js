

import { Server } from 'socket.io'; 

let io; 
const activeUsers = new Map(); 
export const initSocket = (server, app) => {
    io = new Server(server, { cors: {
             origin: process.env.CLIENT_URL,
             methods: ["GET", "POST"],
         } });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('user_connect', (userId) => {
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} is now online and mapped to ${socket.id}`);
        });


        socket.on('private_message', (data) => {
            const receiverSocketId = activeUsers.get(data.receiverId);
            const senderSocketId = socket.id;

            if (receiverSocketId) {
            
                io.to(receiverSocketId).emit('private_message', data); 
                
                if (receiverSocketId !== senderSocketId) {
                     io.to(senderSocketId).emit('private_message', data); 
                }
            } else {
               
                const statusMessage = {
                    senderId: 'SYSTEM',
                    text: `${data.receiverName || 'The user'} is currently offline.`,
                };
                io.to(senderSocketId).emit('private_message', statusMessage); 
                console.log(`User ${data.receiverId} is offline.`);
                
            }
        });

   
        socket.on('disconnect', () => {
          
            for (let [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    activeUsers.delete(userId);
                    console.log(`User ${userId} disconnected. Removed from map.`);
                    break;
                }
            }
        });
    });
};

export const getIo = () => io;