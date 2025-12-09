import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/users'; // NEW API endpoint

const UserList = ({ onSelectUser, selectedUserId }) => {
    const { user } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // You need to secure this endpoint on the backend with JWT
                const token = localStorage.getItem('token'); 
                const response = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Filter out the current user
                const otherUsers = response.data.filter(u => u._id !== user._id);
                setUsers(otherUsers);
            } catch (error) {
                console.error("Error fetching user list:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user._id]);

    if (loading) return <div className="p-4 text-center">Loading users...</div>;

    return (
        <div className="w-1/4 border-r border-gray-200 bg-white">
            <h3 className="p-4 text-lg font-bold border-b">Chats</h3>
            {users.map((u) => (
                <div
                    key={u._id}
                    onClick={() => onSelectUser(u)} // Call the parent function to select
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition ${selectedUserId === u._id ? 'bg-blue-100 font-semibold' : ''}`}
                >
                    {u.username}
                </div>
            ))}
        </div>
    );
};

export default UserList;