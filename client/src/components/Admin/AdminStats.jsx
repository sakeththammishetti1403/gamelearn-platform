import React, { useState, useEffect } from 'react';
import { getStats } from '../../services/api';
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

    if (loading) return <div className="container"><Loading message="Calculating system metrics..." /></div>;
    if (error) return <div className="container"><ErrorMessage message={error} onRetry={loadStats} /></div>;

    return (
        <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Users</p>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>{stats?.users || 0}</h2>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subjects</p>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--secondary)', margin: 0 }}>{stats?.subjects || 0}</h2>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modules</p>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--status-warning)', margin: 0 }}>{stats?.modules || 0}</h2>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Games Played</p>
                    <h2 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--status-success)', margin: 0 }}>{stats?.gamesPlayed || 0}</h2>
                </div>
            </div>
        </div>
    );
}

export default AdminStats;
