import React, { useState, useEffect } from 'react';
import { getUsers } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

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
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>User Directory</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-app)' }}>
                            <th style={{ padding: '12px 24px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em' }}>NAME</th>
                            <th style={{ padding: '12px 24px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em' }}>EMAIL</th>
                            <th style={{ padding: '12px 24px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em' }}>ROLE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px 24px', color: 'var(--text-main)', fontWeight: '500', fontSize: '14px' }}>{user.name}</td>
                                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>{user.email}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
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

export default UserList;
