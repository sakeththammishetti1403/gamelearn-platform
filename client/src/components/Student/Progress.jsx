import React, { useState, useEffect } from 'react';
import { getDetailedProgress } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';
import AnalyticsPieChart from './Analytics/AnalyticsPieChart';
import AnalyticsBarChart from './Analytics/AnalyticsBarChart';

function Progress() {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ completed: 0, available: 0, notStarted: 0, total: 0 });
    const [error, setError] = useState('');

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getDetailedProgress();
            const data = response.data;
            setProgressData(data);
            calculateStats(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load progress data');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        let completed = 0;
        let available = 0;
        let total = 0;

        data.forEach(subject => {
            subject.modules.forEach(module => {
                completed += module.completedSectionsCount || 0;
                available += module.unlockedSectionsCount || 0;
                total += module.totalSections || 0;
            });
        });

        const notStarted = total - completed - available;
        setStats({ completed, available, notStarted, total });
    };

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Analyzing your progress..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadProgress} /></div>;

    return (
        <div className="container fade-in">
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Learning Progress</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Track your journey across all subjects and modules.</p>
            </header>

            {progressData.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '48px',
                    flexWrap: 'wrap',
                    alignItems: 'stretch'
                }}>
                    <div className="card" style={{ flex: '1', minWidth: '300px' }}>
                        <AnalyticsPieChart
                            completed={stats.completed}
                            inProgress={stats.available}
                            notStarted={stats.notStarted}
                        />
                    </div>
                    <div className="card" style={{ flex: '2', minWidth: '400px' }}>
                        <AnalyticsBarChart subjects={progressData} />
                    </div>
                </div>
            )}

            {progressData.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '24px', opacity: 0.8 }}>📈</div>
                    <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>No progress data yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Start a course to see your progress here!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {progressData.map((subject) => (
                        <div key={subject._id} className="card" style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    backgroundImage: `url(${subject.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '1px solid var(--border-color)'
                                }} />
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>{subject.title}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '4px', overflow: 'hidden', maxWidth: '300px' }}>
                                            <div style={{ width: `${subject.overallProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        </div>
                                        <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '14px' }}>{subject.overallProgress}% Overall</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {subject.modules.map((module) => (
                                    <div key={module._id} style={{
                                        padding: '20px',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--bg-app)',
                                        border: '1px solid var(--border-color)',
                                        transition: 'var(--transition)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>MODULE {module.order}</span>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: module.progress === 100 ? 'var(--status-success)' : 'var(--primary)' }}>
                                                {module.progress}%
                                            </span>
                                        </div>
                                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '14px' }}>{module.title}</h4>
                                        <div style={{ height: '4px', backgroundColor: '#CBD5E1', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
                                            <div style={{ width: `${module.progress}%`, height: '100%', backgroundColor: module.progress === 100 ? 'var(--status-success)' : 'var(--primary)' }} />
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            Sections: <strong style={{ color: 'var(--text-main)' }}>{module.completedSectionsCount} / {module.totalSections}</strong>
                                            {module.lastSection && (
                                                <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '11px' }}>
                                                    Last: {module.lastSection}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Progress;
