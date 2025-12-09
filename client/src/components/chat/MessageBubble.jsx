import React from 'react';

const MessageBubble = ({ message, isCurrentUser }) => {
    // Determine the alignment and color based on the sender
    const containerClasses = isCurrentUser 
        ? "flex justify-end" 
        : "flex justify-start";
        
    const bubbleClasses = isCurrentUser
        ? "bg-blue-500 text-white rounded-tr-none" 
        : "bg-gray-200 text-gray-800 rounded-tl-none";

    return (
        <div className={`p-2 ${containerClasses}`}>
            <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow ${bubbleClasses}`}
            >
                {!isCurrentUser && (
                    <div className="mb-1 text-xs font-semibold">{message.senderName}</div>
                )}
                <p className="whitespace-pre-wrap">{message.text}</p>
                <span className={`block mt-1 text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                    {message.time || 'Time missing'}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;