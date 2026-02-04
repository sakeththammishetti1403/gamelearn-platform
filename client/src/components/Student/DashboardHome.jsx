import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStudentStats, getLearningPath } from '../../services/api';
import StatsCards from './StatsCards';
import LearningPath from './LearningPath';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function DashboardHome() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            const [statsRes, pathRes] = await Promise.all([
                getStudentStats(),
                getLearningPath()
            ]);
            setStats(statsRes.data);
            setPath(pathRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container"><Loading message="Loading dashboard..." /></div>;
    if (error) return <div className="container"><ErrorMessage message={error} onRetry={loadDashboardData} /></div>;

    return (
        <div className="container fade-in">
            <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Welcome back, {user?.name.split(' ')[0]}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', lineHeight: '1.5' }}>
                    Your academic progress is on track. Pick up where you left off below.
                </p>
            </header>

            {stats && <StatsCards stats={stats} />}

            <div className="card" style={{
                marginTop: '32px',
                padding: '24px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundImage: 'linear-gradient(45deg, var(--primary) 0%, var(--primary-hover) 100%)'
            }}>
                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'white' }}>Multiplayer Arena</h3>
                    <p style={{ opacity: 0.9, fontSize: '15px' }}>Challenge your peers in real-time academic quiz battles.</p>
                </div>
                <button
                    className="btn"
                    style={{
                        backgroundColor: 'white',
                        color: 'var(--primary)',
                        border: 'none',
                        fontWeight: '700',
                        padding: '12px 24px'
                    }}
                    onClick={() => navigate('/student/multiplayer')}
                >
                    Enter Arena →
                </button>
            </div>

            <div style={{ marginTop: '48px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--text-main)' }}>Current Curriculum</h2>
                <LearningPath path={path} />
            </div>
        </div>
    );
}

export default DashboardHome;
