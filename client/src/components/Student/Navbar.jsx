import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="nav">
            <h2>Game-Based Learning Platform</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span>Welcome, {user?.name} ({user?.role})</span>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
