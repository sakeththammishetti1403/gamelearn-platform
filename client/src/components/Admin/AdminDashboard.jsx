import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../Student/Sidebar';
import { getUsers, getStats, getSubjects, getModules, updateSubjectStatus, updateModuleStatus } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function AdminStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getStats();
            setStats(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading message="Calculating system metrics..." />;
    if (error) return <ErrorMessage message={error} onRetry={loadStats} />;

    return (
        <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: '#7A859E', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Users</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#4F7DF3' }}>{stats?.users || 0}</h2>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: '#7A859E', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Subjects</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#4F7DF3' }}>{stats?.subjects || 0}</h2>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: '#7A859E', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Modules</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#4F7DF3' }}>{stats?.modules || 0}</h2>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: '#7A859E', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Games Played</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#4F7DF3' }}>{stats?.gamesPlayed || 0}</h2>
                </div>
            </div>
        </div>
    );
}

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading message="Fetching user directory..." />;
    if (error) return <ErrorMessage message={error} onRetry={loadUsers} />;

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #E5E9F2' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2E3A59' }}>User Directory</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F6F8FC' }}>
                            <th style={{ padding: '16px 24px', color: '#7A859E', fontSize: '13px', fontWeight: '600' }}>NAME</th>
                            <th style={{ padding: '16px 24px', color: '#7A859E', fontSize: '13px', fontWeight: '600' }}>EMAIL</th>
                            <th style={{ padding: '16px 24px', color: '#7A859E', fontSize: '13px', fontWeight: '600' }}>ROLE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #F0F2F5' }}>
                                <td style={{ padding: '16px 24px', color: '#2E3A59', fontWeight: '600', fontSize: '14px' }}>{user.name}</td>
                                <td style={{ padding: '16px 24px', color: '#7A859E', fontSize: '14px' }}>{user.email}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        backgroundColor: user.role === 'admin' ? '#FEE2E2' : user.role === 'instructor' ? '#FEF3C7' : '#E0E7FF',
                                        color: user.role === 'admin' ? '#991B1B' : user.role === 'instructor' ? '#92400E' : '#3730A3'
                                    }}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ContentManager() {
    const [subjects, setSubjects] = useState([]);
    const [modules, setModules] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        try {
            const subRes = await getSubjects();
            setSubjects(subRes.data);
            const moduleData = {};
            for (let sub of subRes.data) {
                const modRes = await getModules(sub._id);
                moduleData[sub._id] = modRes.data;
            }
            setModules(moduleData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSubject = async (id, currentStatus) => {
        try {
            await updateSubjectStatus(id, !currentStatus);
            loadAll();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const toggleModule = async (id, currentStatus) => {
        try {
            await updateModuleStatus(id, !currentStatus);
            loadAll();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <Loading message="Loading content status..." />;

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #E5E9F2' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2E3A59' }}>Content Visibility</h3>
            </div>
            <div style={{ padding: '24px', display: 'grid', gap: '20px' }}>
                {subjects.map(subject => (
                    <div key={subject._id} style={{ padding: '16px', backgroundColor: '#F6F8FC', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#2E3A59' }}>{subject.title}</h4>
                            <button
                                onClick={() => toggleSubject(subject._id, subject.isActive)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: subject.isActive ? '#FEE2E2' : '#DCFCE7',
                                    color: subject.isActive ? '#991B1B' : '#166534',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                {subject.isActive ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                        <div style={{ display: 'grid', gap: '8px', paddingLeft: '12px', borderLeft: '2px solid #E5E9F2' }}>
                            {modules[subject._id]?.map(module => (
                                <div key={module._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#7A859E' }}>{module.title}</span>
                                    <button
                                        onClick={() => toggleModule(module._id, module.isActive)}
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            backgroundColor: module.isActive ? '#FEE2E2' : '#DCFCE7',
                                            color: module.isActive ? '#991B1B' : '#166534',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {module.isActive ? 'Off' : 'On'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdminDashboard() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fcfcfc' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '280px' }}>
                <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '48px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2E3A59', marginBottom: '8px' }}>Admin Control Center</h1>
                        <p style={{ color: '#7A859E', fontSize: '16px' }}>Monitor system health and manage platform users.</p>
                    </header>
                    <AdminStats />
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                        <UserList />
                        <ContentManager />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;

