import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
const Header = ({ title, isConnected, onLogout, username }) => {
    const navigate = useNavigate();


    const { logout } = useAuthContext();
    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md border-b">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                {/* Connection Status Indicator */}
                <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                        {isConnected ? 'Online' : 'Offline'}
                    </span>
                </div>
                
                {/* User Info and Logout */}
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">{username}</span>
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-150"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;