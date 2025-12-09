

import React, { createContext, useContext, useState } from 'react';
// ⚠️ NOTE: We do NOT import 'useNavigate' here. Navigation logic is now handled 
// by the components (like Header) that call 'logout'.

// 1. Create the Context object
const AuthContext = createContext();

// Helper for consuming the context
export const useAuthContext = () => useContext(AuthContext);

// 2. The Provider Component
export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage to persist login across page reloads
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    /**
     * Updates local state and localStorage upon successful login.
     * @param {object} userData - User object (e.g., { _id, username })
     * @param {string} userToken - JWT token
     */
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        // Navigation (redirect to chat) is handled in LoginPage.jsx
    };

    /**
     * Clears user state and storage upon logout.
     * The component calling this function (e.g., Header) must handle the redirect.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Navigation (redirect to login) is handled by the calling component
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return (
        // The simple, clean Provider structure
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};