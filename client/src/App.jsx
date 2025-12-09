import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// import RegisterPage

import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext'; // Import Auth Context
import { SocketProvider } from './context/SocketContext'; // Import Socket Context

const App = () => {
  return (
    <BrowserRouter>
      {/* 1. Global Context Providers */}
      <AuthProvider>
        <SocketProvider>
          
          {/* 2. Routing Setup */}
          <Routes>
            
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
            
            {/* Protected Route (Requires Authentication) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ChatPage />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<div className="text-center mt-20 text-xl font-bold">404 Not Found</div>} />
          </Routes>
          
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;