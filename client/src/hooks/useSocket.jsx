import { useEffect, useState, useRef, useContext, createContext } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000"; // Replace with your Express server port

const SocketContext = createContext();

// 1. Hook to manage connection lifecycle
export const useSocket = () => {
    // Note: We are using a custom hook just for connection logic. 
    // The context will be provided by SocketProvider.
    const socketRef = useRef(null); 
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL);
        socketRef.current = socket;

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        return () => {
            socket.disconnect(); // Clean up connection on unmount
        };
    }, []);

    return { socket: socketRef.current, isConnected };
};

// 2. Provider component to expose the socket globally
export const SocketProvider = ({ children }) => {
    const { socket, isConnected } = useSocket();
    
    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

// 3. Simple custom hook to use the context
export const useSocketContext = () => {
    return useContext(SocketContext);
};