import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuthContext();
    
    // Renders child components if authenticated, otherwise redirects to login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;