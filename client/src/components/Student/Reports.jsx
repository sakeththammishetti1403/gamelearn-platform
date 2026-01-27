import React, { useState, useEffect } from 'react';
import { getStudentStats } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function Reports() {
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
            const response = await getStudentStats();
            setStats(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Generating your report..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadStats} /></div>;

    const achievements = [
        { title: 'Quick Learner', description: 'Complete 3 sections in one day', icon: '⚡', unlocked: stats.dayStreak >= 1, color: '#FF9800' },
        { title: 'Game Master', description: 'Complete 5 game sections', icon: '🎮', unlocked: stats.gamesPlayed >= 5, color: '#4CAF50' },
        { title: 'Knowledge Seeker', description: 'Complete your first module', icon: '📖', unlocked: stats.levelsCompleted >= 1, color: '#4F7DF3' },
        { title: 'High Achiever', description: 'Earn more than 500 points', icon: '🌟', unlocked: stats.totalPoints >= 500, color: '#9C27B0' },
    ];

    return (
        <div className="fade-in" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2E3A59', marginBottom: '12px' }}>Learning Reports</h1>
                <p style={{ color: '#7A859E', fontSize: '18px' }}>Your achievements and learning statistics at a glance.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '56px' }}>
                <div style={statCardStyle}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>💎</div>
                    <div style={statValueStyle}>{stats.totalPoints}</div>
                    <div style={statLabelStyle}>Total Points</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏆</div>
                    <div style={statValueStyle}>{stats.levelsCompleted}</div>
                    <div style={statLabelStyle}>Modules Completed</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>🎮</div>
                    <div style={statValueStyle}>{stats.gamesPlayed}</div>
                    <div style={statLabelStyle}>Games Played</div>
                </div>
                <div style={statCardStyle}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏱️</div>
                    <div style={statValueStyle}>{stats.hoursLearned}h</div>
                    <div style={statLabelStyle}>Learning Time</div>
                </div>
            </div>

            <section>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2E3A59', marginBottom: '32px' }}>Achievements</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {achievements.map((ach, idx) => (
                        <div key={idx} style={{
                            padding: '32px',
                            borderRadius: '24px',
                            backgroundColor: '#fff',
                            border: '1px solid #E5E9F2',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '16px',
                            opacity: ach.unlocked ? 1 : 0.6,
                            filter: ach.unlocked ? 'none' : 'grayscale(0.8)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            boxShadow: ach.unlocked ? '0 4px 12px rgba(46, 58, 89, 0.06)' : 'none'
                        }}>
                            {!ach.unlocked && (
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: '#7A859E',
                                    backgroundColor: '#F6F8FC',
                                    padding: '4px 10px',
                                    borderRadius: '10px'
                                }}>🔒 LOCKED</div>
                            )}
                            <div style={{
                                fontSize: '40px',
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                backgroundColor: ach.unlocked ? `${ach.color}10` : '#F6F8FC',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px'
                            }}>{ach.icon}</div>
                            <div>
                                <h4 style={{ color: '#2E3A59', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{ach.title}</h4>
                                <p style={{ fontSize: '14px', color: '#7A859E', lineHeight: '1.5' }}>{ach.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const statCardStyle = {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '24px',
    border: '1px solid #E5E9F2',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(46, 58, 89, 0.04)'
};

const statValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2E3A59',
    marginBottom: '4px'
};

const statLabelStyle = {
    fontSize: '14px',
    color: '#7A859E',
    fontWeight: '500'
};

export default Reports;

