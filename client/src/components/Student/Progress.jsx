import React, { useState, useEffect } from 'react';
import { getDetailedProgress } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function Progress() {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getDetailedProgress();
            setProgressData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load progress data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Analyzing your progress..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadProgress} /></div>;

    return (
        <div className="fade-in" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2E3A59', marginBottom: '12px' }}>Learning Progress</h1>
                <p style={{ color: '#7A859E', fontSize: '18px' }}>Track your journey across all subjects and modules.</p>
            </header>

            {progressData.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 40px',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    border: '1px solid #E5E9F2',
                    boxShadow: '0 2px 8px rgba(46, 58, 89, 0.04)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>📈</div>
                    <h3 style={{ fontSize: '20px', color: '#2E3A59', marginBottom: '12px' }}>No progress data yet</h3>
                    <p style={{ color: '#7A859E' }}>Start a course to see your progress here!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {progressData.map((subject) => (
                        <div key={subject._id} style={{
                            backgroundColor: '#fff',
                            borderRadius: '32px',
                            padding: '40px',
                            border: '1px solid #E5E9F2',
                            boxShadow: '0 4px 20px rgba(46, 58, 89, 0.03)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '20px',
                                    backgroundImage: `url(${subject.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '1px solid #E5E9F2'
                                }} />
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2E3A59', marginBottom: '12px' }}>{subject.title}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ flex: 1, height: '8px', backgroundColor: '#EEF2FF', borderRadius: '4px', overflow: 'hidden', maxWidth: '400px' }}>
                                            <div style={{ width: `${subject.overallProgress}%`, height: '100%', backgroundColor: '#4F7DF3', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                        </div>
                                        <span style={{ fontWeight: '700', color: '#4F7DF3', fontSize: '15px' }}>{subject.overallProgress}% Overall</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                {subject.modules.map((module) => (
                                    <div key={module._id} style={{
                                        padding: '24px',
                                        borderRadius: '20px',
                                        backgroundColor: '#F6F8FC',
                                        border: '1px solid #E5E9F2',
                                        transition: 'var(--transition)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#7A859E', letterSpacing: '0.5px' }}>MODULE {module.order}</span>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: module.progress === 100 ? '#4CAF50' : '#4F7DF3' }}>
                                                {module.progress}%
                                            </span>
                                        </div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2E3A59', marginBottom: '16px' }}>{module.title}</h4>
                                        <div style={{ height: '6px', backgroundColor: '#E5E9F2', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                                            <div style={{ width: `${module.progress}%`, height: '100%', backgroundColor: module.progress === 100 ? '#4CAF50' : '#4F7DF3' }} />
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#7A859E' }}>
                                            <div style={{ marginBottom: '6px' }}>
                                                Sections: <strong style={{ color: '#2E3A59' }}>{module.completedSections} / {module.totalSections}</strong>
                                            </div>
                                            <div style={{ color: '#7A859E', fontSize: '12px', fontStyle: 'italic' }}>
                                                Last: {module.lastSection}
                                            </div>
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
