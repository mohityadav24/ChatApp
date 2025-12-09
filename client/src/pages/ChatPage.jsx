


import React, { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useAuthContext } from '../context/AuthContext';
import Header from '../components/layout/Header';
import MessageInput from '../components/chat/MessageInput';
import MessageBubble from '../components/chat/MessageBubble'; 
import UserList from './UserList';

const ChatPage = () => {
    const { socket, isConnected } = useSocketContext();
    const { user, logout } = useAuthContext();
    
    // State to store all messages, regardless of chat partner
    const [messages, setMessages] = useState([]); 
    
    // State to track the currently selected user for private chat
    const [selectedUser, setSelectedUser] = useState(null); 
    
    const messagesEndRef = useRef(null);
    
    // Ensure user data is available
    const CURRENT_USER_ID = user?._id || 'guest';
    const CURRENT_USER_NAME = user?.username || 'Guest';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, selectedUser]); // Scroll when messages or selected user changes

    // -----------------------------------------------------------
    // 1. SOCKET CONNECTION & LISTENING LOGIC
    // -----------------------------------------------------------
    useEffect(() => {
        if (!socket || !user) return;

        // A. Identify the current user to the backend
        // This is crucial for the backend to map user ID to socket ID.
        socket.emit('user_connect', user._id); 
        console.log(`Emitting user_connect for ID: ${user._id}`);

        // B. Listener for incoming PRIVATE messages
        socket.on('private_message', (msg) => {
            console.log("Received private message:", msg);
            setMessages(prev => [...prev, msg]);
        });

        // C. Listener for general status/info (optional)
        socket.on('status_update', (msg) => {
            console.log("Status:", msg);
        });

        return () => {
            socket.off('private_message');
            socket.off('status_update');
        };
    }, [socket, user]);

    // -----------------------------------------------------------
    // 2. HANDLERS
    // -----------------------------------------------------------

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        // In a production app, you would fetch history with this user here
    };

    const handleSendMessage = (text) => {
        if (!socket || !text.trim() || !selectedUser) {
            console.warn("Cannot send message: Not connected or no user selected.");
            return;
        }

        const newMessage = {
            senderId: CURRENT_USER_ID,
            senderName: CURRENT_USER_NAME,
            receiverId: selectedUser._id, // 👈 TARGET THE SELECTED USER
            text: text,
            timestamp: Date.now(),
        };
        
        // Emit the message to the backend using the 'private_message' event
        socket.emit('private_message', newMessage);
        
        // Add message to local state immediately for fast UI feedback
        setMessages(prev => [...prev, newMessage]); 
    };

    // Filter messages to show only the current conversation
    const filteredMessages = messages.filter(msg => {
        // Message is either SENT by current user TO selected user, 
        // OR RECEIVED by current user FROM selected user.
        const sentToSelected = msg.senderId === CURRENT_USER_ID && msg.receiverId === selectedUser._id;
        const receivedFromSelected = msg.senderId === selectedUser._id && msg.receiverId === CURRENT_USER_ID;
        
        return sentToSelected || receivedFromSelected;
    });

    // -----------------------------------------------------------
    // 3. RENDER
    // -----------------------------------------------------------

    return (
        <div className="flex h-screen bg-gray-50">
            {/* User List Sidebar */}
            <UserList 
                onSelectUser={handleSelectUser} 
                selectedUserId={selectedUser?._id} 
            />

            {/* Main Chat Area */}
            <div className="flex flex-col flex-grow">
                {/* Header */}
                <Header 
                    title={selectedUser ? `Chatting with ${selectedUser.username}` : "Select a User"} 
                    isConnected={isConnected} 
                    username={CURRENT_USER_NAME} 
                />
                
                {/* Message List/Window */}
                <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-100">
                    {!selectedUser ? (
                        <div className="text-center text-gray-500 mt-20">
                            Please select a user from the left to start chatting.
                        </div>
                    ) : (
                        filteredMessages.map((msg, index) => (
                            <MessageBubble 
                                key={index} 
                                message={msg}
                                isCurrentUser={msg.senderId === CURRENT_USER_ID} 
                            />
                        ))
                    )}
                    <div ref={messagesEndRef} /> {/* Scroll target */}
                </div>

                {/* Input Area */}
                <MessageInput 
                    onSend={handleSendMessage} 
                    disabled={!selectedUser || !isConnected} // Disable if no user selected
                />
            </div>
        </div>
    );
};

export default ChatPage;