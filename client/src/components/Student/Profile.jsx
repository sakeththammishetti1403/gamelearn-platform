import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from './Career/CareerDataGate';
import { useTheme } from '../../context/ThemeContext';
import api, { getStudentStats, getDetailedProgress, getHeatmapData, getGlobalLeaderboard } from '../../services/api';
import Loading from '../Common/Loading';
import Heatmap from './Heatmap';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { activeTrack } = useCareer();
    const { theme, toggleTheme } = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [stats, setStats] = useState(null);
    const [progress, setProgress] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

    const handleTabChange = (tab) => {
        setSearchParams({ tab });
    };

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setLoading(true);
        try {
            const [statsRes, progRes, heatmapRes, rewardRes, leadRes] = await Promise.all([
                getStudentStats(),
                getDetailedProgress(),
                getHeatmapData(),
                api.get('/reward/my-rewards'),
                getGlobalLeaderboard()
            ]);
            setStats(statsRes.data);
            setProgress(progRes.data);
            setHeatmap(heatmapRes.data);
            setRewards(rewardRes.data);
            setLeaderboard(leadRes.data);
        } catch (err) {
            console.error('Error loading profile data:', err);
        } finally {
            setLoading(false);
        }
    };

    const downloadCertificate = async (rewardId, moduleTitle) => {
        try {
            const response = await api.get(`/reward/certificate/${rewardId}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate_${moduleTitle.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download certificate.');
        }
    };

    const currentUserRank = leaderboard.findIndex(l => l.userId?._id === user?._id) + 1;

    const achievements = stats ? [
        { title: 'Quick Learner', description: 'Complete 3 sections in one day', icon: '⚡', unlocked: stats.dayStreak >= 1, color: '#FF9800' },
        { title: 'Game Master', description: 'Complete 5 game sections', icon: '🎮', unlocked: stats.gamesPlayed >= 5, color: '#4CAF50' },
        { title: 'Knowledge Seeker', description: 'Complete your first module', icon: '📖', unlocked: stats.levelsCompleted >= 1, color: '#4F7DF3' },
        { title: 'High Achiever', description: 'Earn more than 500 points', icon: '🌟', unlocked: stats.totalPoints >= 500, color: '#9C27B0' },
    ] : [];

    // Helper to format date safely
    const formatDate = (dateString) => {
        if (!dateString) return 'Member since Jan 2026';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? 'Member since Jan 2026' : `Joined ${d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`;
    };

    if (loading) return <Loading message="Syncing your academic profile..." />;

    return (
        <div className="container fade-in" style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Profile Header */}
            <div className="card" style={{ padding: '32px', borderRadius: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '24px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 20px rgba(51, 84, 149, 0.15)'
                }}>
                    {user?.name.charAt(0)}
                </div>
                <div>
                    <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '4px', fontWeight: '800' }}>{user?.name}</h1>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-tertiary)', fontSize: '14px' }}>
                        <span>{formatDate(user?.createdAt)}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Rank #{currentUserRank || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border-soft)', paddingBottom: '2px' }}>
                <TabButton active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} label="Overview" icon="🏠" />
                <TabButton active={activeTab === 'progress'} onClick={() => handleTabChange('progress')} label="Progress" icon="📊" />
                <TabButton active={activeTab === 'achievements'} onClick={() => handleTabChange('achievements')} label="Achievements" icon="🎖️" />
                <TabButton active={activeTab === 'certificates'} onClick={() => handleTabChange('certificates')} label="Certificates" icon="📜" />
                <TabButton active={activeTab === 'settings'} onClick={() => handleTabChange('settings')} label="Settings" icon="⚙️" />
            </div>

            {/* Tab Content */}
            <div className="tab-content" style={{ transition: 'all 0.3s ease' }}>
                {activeTab === 'overview' && (
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                            <div className="card shadow-sm" style={{ padding: '24px', borderRadius: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                                        Learning Grit
                                    </h2>
                                    <div style={{ display: 'flex', gap: '24px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}>{stats?.dayStreak} Days 🔥</span>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>{stats?.accuracy}% Accuracy 🎯</span>
                                    </div>
                                </div>
                                <Heatmap data={heatmap} />
                            </div>

                            <div className="card shadow-sm" style={{ padding: '24px', borderRadius: '20px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>⚡ Skill Analysis</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {stats?.skillDistribution.slice(0, 5).map(skill => (
                                        <div key={skill.subject} style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-app)', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{skill.subject}</span>
                                            <span style={{ fontWeight: '700' }}>{skill.score} XP</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Career Track Status */}
                        <div className="card shadow-sm" style={{
                            marginTop: '32px',
                            padding: '32px',
                            borderRadius: '24px',
                            background: activeTrack ? 'linear-gradient(135deg, var(--bg-card), var(--primary-light))' : 'var(--bg-card)',
                            border: activeTrack ? '1px solid var(--primary)' : '1px solid var(--border-soft)',
                        }}>
                            {activeTrack ? (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>🎓 Active Guidance</div>
                                            <h4 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>{activeTrack.title}</h4>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '900', marginBottom: '4px' }}>ALIGNMENT</div>
                                            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)' }}>{activeTrack.alignmentScore ?? 0}%</div>
                                        </div>
                                    </div>
                                    <div style={{ height: '14px', backgroundColor: 'rgba(51, 84, 149, 0.1)', borderRadius: '7px', overflow: 'hidden', marginBottom: '32px' }}>
                                        <div style={{ width: `${activeTrack.alignmentScore ?? 0}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '7px' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <button onClick={() => navigate(`/student/career/track/${activeTrack._id}`)} className="btn btn-primary">Open Roadmap</button>
                                        <button onClick={() => handleTabChange('progress')} className="btn btn-outline" style={{ border: '1px solid var(--border-color)' }}>View Detailed Progress</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>🧭</div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Map Your Career</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Pick a career goal to see curated learning recommendations.</p>
                                    <button onClick={() => navigate('/student/career')} className="btn btn-primary" style={{ padding: '12px 40px' }}>Explore Paths</button>
                                </div>
                            )}
                        </div>

                        {/* Global Standing Footer */}
                        <div style={{ marginTop: '40px', padding: '32px', backgroundColor: 'var(--primary)', borderRadius: '24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Global Academic Standing</h3>
                                <p style={{ opacity: 0.9, fontSize: '16px', margin: '4px 0 0 0' }}>Join the top echelon of student engineers worldwide.</p>
                            </div>
                            <button onClick={() => setShowFullLeaderboard(true)} style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '16px 40px', borderRadius: '16px', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '16px' }}>View Global Board</button>
                        </div>
                    </div>
                )}

                {activeTab === 'progress' && (
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                            <StatBox icon="💎" value={stats?.totalPoints} label="Total Points" />
                            <StatBox icon="🏆" value={stats?.levelsCompleted} label="Modules Finished" />
                            <StatBox icon="🎮" value={stats?.gamesPlayed} label="Arena Battles" />
                            <StatBox icon="⏱️" value={`${stats?.hoursLearned}h`} label="Learning Time" />
                        </div>

                        <div className="card shadow-sm" style={{ padding: '32px', borderRadius: '20px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Curriculum Explorer</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                {progress.map((subject) => (
                                    <SubjectProgressCard key={subject._id} subject={subject} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                            {achievements.map((ach, idx) => (
                                <AchievementCard key={idx} ach={ach} />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'certificates' && (
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {rewards.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', backgroundColor: 'var(--bg-card)', borderRadius: '24px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📜</div>
                                    <h3>No Certificates Yet</h3>
                                    <p style={{ color: 'var(--text-tertiary)' }}>Complete course modules to earn certified credentials.</p>
                                </div>
                            ) : (
                                rewards.map(r => (
                                    <div key={r._id} className="card shadow-sm" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ fontSize: '40px' }}>🎓</div>
                                        <h4 style={{ margin: 0, fontWeight: '800' }}>{r.moduleId?.title}</h4>
                                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>Issued upon module completion.</p>
                                        <button onClick={() => downloadCertificate(r._id, r.moduleId?.title)} className="btn btn-primary" style={{ marginTop: 'auto' }}>Download PDF</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="fade-in card shadow-sm" style={{ padding: '32px', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Account Settings</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <h4 style={{ marginBottom: '8px' }}>Interface Theme</h4>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginBottom: '16px' }}>Personalize your learning environment.</p>
                                <button onClick={toggleTheme} className="btn btn-outline" style={{ border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {theme === 'light' ? '🌙 Switch to Dark' : '☀️ Switch to Light'}
                                </button>
                            </div>
                            <div style={{ height: '1px', backgroundColor: 'var(--border-soft)' }} />
                            <div>
                                <h4 style={{ marginBottom: '8px' }}>Privacy</h4>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginBottom: '16px' }}>Manage how your progress is displayed on the global leaderboard.</p>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked />
                                    <span>Show my profile on leaderboard</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Leaderboard Modal */}
            {showFullLeaderboard && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '40px', backdropFilter: 'blur(8px)' }}>
                    <div className="card shadow" style={{ width: '100%', maxWidth: '900px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '32px', backgroundColor: 'white' }}>
                        <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Global Leaderboard</h2>
                            <button onClick={() => setShowFullLeaderboard(false)} style={{ border: 'none', background: 'none', fontSize: '32px', color: 'var(--text-tertiary)', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <th style={{ padding: '12px' }}>Rank</th>
                                        <th style={{ padding: '12px' }}>Student</th>
                                        <th style={{ padding: '12px' }}>Academy XP</th>
                                        <th style={{ padding: '12px' }}>Achievements</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((student, index) => (
                                        <tr key={student.userId._id} style={{ backgroundColor: student.userId._id === user?._id ? 'var(--primary-light)' : 'var(--bg-app)', borderRadius: '16px' }}>
                                            <td style={{ padding: '20px 12px', fontWeight: '900', color: index < 3 ? 'var(--primary)' : 'var(--text-secondary)', fontSize: '18px' }}>#{index + 1}</td>
                                            <td style={{ padding: '20px 12px', fontWeight: '700' }}>{student.userId.name} {student.userId._id === user?._id && '(You)'}</td>
                                            <td style={{ padding: '20px 12px', fontWeight: '800' }}>{student.totalScore.toLocaleString()} XP</td>
                                            <td style={{ padding: '20px 12px' }}>{student.modulesCompleted > 0 ? '🎖️'.repeat(Math.min(student.modulesCompleted, 3)) : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        style={{
            padding: '12px 24px',
            borderRadius: '12px 12px 0 0',
            border: 'none',
            background: active ? 'var(--primary-light)' : 'transparent',
            color: active ? 'var(--primary)' : 'var(--text-tertiary)',
            fontSize: '15px',
            fontWeight: active ? '700' : '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            borderBottom: active ? '3px solid var(--primary)' : '3px solid transparent'
        }}
    >
        <span>{icon}</span> {label}
    </button>
);

const StatBox = ({ icon, value, label }) => (
    <div className="card shadow-sm" style={{ padding: '24px', borderRadius: '24px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>{value}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
);

const AchievementCard = ({ ach }) => (
    <div style={{
        padding: '32px',
        borderRadius: '24px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '16px',
        opacity: ach.unlocked ? 1 : 0.6,
        filter: ach.unlocked ? 'none' : 'grayscale(0.8)',
        transition: 'all 0.3s ease',
        position: 'relative',
        boxShadow: ach.unlocked ? 'var(--shadow-md)' : 'none'
    }}>
        {!ach.unlocked && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '10px', fontWeight: '800', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-app)', padding: '4px 8px', borderRadius: '8px' }}>🔒 LOCKED</div>
        )}
        <div style={{
            fontSize: '40px',
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            backgroundColor: ach.unlocked ? `${ach.color}15` : 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>{ach.icon}</div>
        <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{ach.title}</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', lineHeight: '1.5' }}>{ach.description}</p>
        </div>
    </div>
);

// Helper Component for Subject Progress
const SubjectProgressCard = ({ subject }) => (
    <div className="skill-card" style={{
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid var(--border-soft)',
        backgroundColor: 'var(--bg-app)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontWeight: '700', fontSize: '15px' }}>{subject.title}</span>
            <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '15px' }}>{subject.overallProgress}%</span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'var(--border-soft)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
                width: `${subject.overallProgress}%`,
                height: '100%',
                backgroundColor: subject.overallProgress === 100 ? '#10b981' : 'var(--primary)',
                borderRadius: '4px'
            }} />
        </div>
    </div>
);

export default Profile;
