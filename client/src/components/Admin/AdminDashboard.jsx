import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../Student/Sidebar';
import AdminStats from './AdminStats';
import UserList from './UserList';
import ContentManager from './ContentManager';

function AdminDashboard() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '260px' }}>
                <div className="container fade-in">
                    <header style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Admin Control Center</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Monitor system health and manage platform users.</p>
                    </header>
                    <AdminStats />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                        <UserList />
                        <ContentManager />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
