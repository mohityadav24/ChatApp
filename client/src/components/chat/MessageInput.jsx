import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="flex items-center p-4 bg-white border-t border-gray-200"
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-3 mr-4 text-gray-700 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            <button
                type="submit"
                disabled={!message.trim()}
                className="p-3 text-white bg-blue-500 rounded-full disabled:bg-blue-300 hover:bg-blue-600 transition duration-150"
            >
                {/* SVG for Send Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </button>
        </form>
    );
};

export default MessageInput;