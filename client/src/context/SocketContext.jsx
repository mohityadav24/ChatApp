import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// 1. Create the Context object
const SocketContext = createContext();

// Helper for consuming the context
export const useSocketContext = () => useContext(SocketContext);

// 2. The Provider Component
export const SocketProvider = ({ children }) => {
    // useRef ensures the socket instance persists across renders
    const socketRef = useRef(null); 
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // 1. Establish the connection
        const socket = io(SOCKET_SERVER_URL, {
             // Optional: Add JWT token to the connection handshake headers if required by your backend
             // auth: { token: localStorage.getItem('token') } 
        });
        socketRef.current = socket;

        // 2. Set up event listeners for connection status
        socket.on('connect', () => {
            setIsConnected(true);
            console.log("Socket connected!");
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log("Socket disconnected.");
        });

        // 3. Clean up the connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    const value = { 
        socket: socketRef.current, 
        isConnected 
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};