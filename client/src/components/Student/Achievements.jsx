import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../Common/Loading';

const Achievements = () => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            const res = await api.get('/reward/my-rewards');
            setRewards(res.data);
        } catch (err) {
            console.error('Error fetching rewards:', err);
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
            alert('Failed to download certificate. Please try again.');
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Certificates & Badges</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Recognizing your dedication to mastering core technical subjects.</p>
            </div>

            {loading ? (
                <Loading message="Loading achievements..." />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                    {/* Badges Section */}
                    <div className="card shadow-sm" style={{ padding: '24px', borderRadius: '16px' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--text-main)' }}>Your Badges</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '16px' }}>
                            {rewards.length > 0 ? (
                                rewards.map((r, i) => (
                                    <div key={r._id} style={{ textAlign: 'center' }} title={`${r.moduleId?.title} Master`}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            backgroundColor: 'rgba(51, 84, 149, 0.1)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '32px',
                                            margin: '0 auto 8px'
                                        }}>
                                            🎖️
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                            {r.moduleId?.title}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>
                                    Complete a module to earn your first badge!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Certificates Section */}
                    <div className="card shadow-sm" style={{ padding: '24px', borderRadius: '16px' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--text-main)' }}>Certificates</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {rewards.length > 0 ? (
                                rewards.map((r) => (
                                    <div key={r._id} style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-soft)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: 'var(--bg-app)'
                                    }}>
                                        <div>
                                            <h3 style={{ fontSize: '16px', margin: '0 0 4px 0' }}>{r.moduleId?.title}</h3>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                                Earned on {new Date(r.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => downloadCertificate(r._id, r.moduleId?.title)}
                                            className="btn btn-primary"
                                            style={{ padding: '8px 16px', fontSize: '12px' }}
                                        >
                                            Download
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>
                                    Certificates will appear here once you complete modules.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Achievements;
