import React, { useState, useEffect } from 'react';
import { getGlobalLeaderboard, getSubjectLeaderboard, getWeeklyLeaderboard, getSubjects } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';

const Leaderboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('global'); // 'global', 'subject', 'weekly'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [activeTab, selectedSubject]);

    const fetchSubjects = async () => {
        try {
            const res = await getSubjects();
            setSubjects(res.data);
            if (res.data.length > 0) setSelectedSubject(res.data[0]._id);
        } catch (err) {
            console.error('Error fetching subjects:', err);
        }
    };

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'global') {
                res = await getGlobalLeaderboard();
            } else if (activeTab === 'subject') {
                if (selectedSubject) res = await getSubjectLeaderboard(selectedSubject);
                else return;
            } else if (activeTab === 'weekly') {
                res = await getWeeklyLeaderboard();
            }
            setData(res.data);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    };

    return (
        <div className="container fade-in" style={{ padding: '40px' }}>
            <div className="card shadow-sm" style={{ padding: '32px', borderRadius: '16px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Leaderboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Compete with your peers and track your academic standing.</p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px',
                    borderBottom: '1px solid var(--border-soft)',
                    paddingBottom: '16px'
                }}>
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`btn ${activeTab === 'global' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '10px 24px' }}
                    >
                        Global
                    </button>
                    <button
                        onClick={() => setActiveTab('subject')}
                        className={`btn ${activeTab === 'subject' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '10px 24px' }}
                    >
                        By Subject
                    </button>
                    <button
                        onClick={() => setActiveTab('weekly')}
                        className={`btn ${activeTab === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '10px 24px' }}
                    >
                        Weekly
                    </button>
                </div>

                {/* Subject Selector */}
                {activeTab === 'subject' && (
                    <div style={{ marginBottom: '24px' }}>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-soft)',
                                backgroundColor: 'var(--bg-app)',
                                color: 'var(--text-main)',
                                minWidth: '200px'
                            }}
                        >
                            {subjects.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {loading ? (
                    <Loading message="Fetching rankings..." />
                ) : data.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-soft)' }}>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Rank</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Student</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'center' }}>Score</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'right' }}>XP Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr
                                        key={item.userId || item.name}
                                        style={{
                                            borderBottom: '1px solid var(--border-soft)',
                                            backgroundColor: item.name === user.name ? 'rgba(51, 84, 149, 0.05)' : 'transparent',
                                            transition: 'background 0.2s ease'
                                        }}
                                        className="leaderboard-row"
                                    >
                                        <td style={{ padding: '16px', fontWeight: 'bold' }}>
                                            {getRankIcon(item.rank)}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--primary)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {item.name.charAt(0)}
                                                </div>
                                                <span style={{
                                                    fontWeight: item.name === user.name ? 'bold' : 'normal',
                                                    color: item.name === user.name ? 'var(--primary)' : 'var(--text-main)'
                                                }}>
                                                    {item.name} {item.name === user.name && '(You)'}
                                                    {item.modulesCompleted > 0 && <span title="Module Master" style={{ marginLeft: '6px' }}>🎖️</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>
                                            {item.score}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <span style={{
                                                backgroundColor: 'rgba(74, 173, 147, 0.1)',
                                                color: '#2a7e6b',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '13px',
                                                fontWeight: '600'
                                            }}>
                                                {item.xp.toLocaleString()} XP
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                        <h3>No rankings available yet</h3>
                        <p>Be the first to score points and top the board!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
