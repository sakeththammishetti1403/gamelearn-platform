import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from './Career/CareerDataGate';

const CareerHub = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { tracks, activeTrack } = useCareer();
    const [searchQuery, setSearchQuery] = useState('');

    const handleAskTutor = () => {
        navigate('/student/support', {
            state: {
                initialSubject: 'Career Guidance',
                initialMessage: 'I am looking for guidance regarding my career path options in Computer Science.'
            }
        });
    };

    const filteredTracks = tracks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeTrackId = user?.activeCareerTrack?._id || user?.activeCareerTrack?.id || user?.activeCareerTrack;

    return (
        <div style={{ padding: '0 20px 60px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Academic Header */}
            <header style={{
                padding: '60px 0 40px',
                textAlign: 'left',
                borderBottom: '1px solid var(--border-soft)',
                marginBottom: '48px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{
                            fontSize: '40px',
                            color: 'var(--text-main)',
                            marginBottom: '16px',
                            fontWeight: '800',
                            letterSpacing: '-0.02em'
                        }}>
                            Career Exploration Hub
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            color: 'var(--text-secondary)',
                            maxWidth: '700px',
                            lineHeight: '1.6'
                        }}>
                            Comprehensive guide to Computer Science career paths. Understand the industry,
                            identify required skillsets, and choose your future with confidence.
                        </p>
                    </div>

                    {/* Support Integration */}
                    <div style={{
                        backgroundColor: 'var(--bg-card)',
                        padding: '20px 32px',
                        borderRadius: '24px',
                        border: '1px solid var(--border-soft)',
                        textAlign: 'right'
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Need Guidance?</div>
                        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', margin: '0 0 12px' }}>Confused about your path? Our tutors can help.</p>
                        <button
                            onClick={handleAskTutor}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                fontWeight: '800',
                                fontSize: '14px',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            Ask a Tutor →
                        </button>
                    </div>
                </div>
            </header>

            {/* Active Path Spotlight */}
            {activeTrack && (
                <div style={{
                    marginBottom: '64px',
                    padding: '40px',
                    borderRadius: '32px',
                    background: 'linear-gradient(135deg, var(--primary), #4F7DF3)',
                    border: '1px solid var(--primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'white',
                    boxShadow: '0 20px 40px rgba(51, 84, 149, 0.2)'
                }}>
                    <div>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: '900',
                            color: 'rgba(255,255,255,0.8)',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '12px'
                        }}>
                            Your Selected Career Path
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
                            {activeTrack.title}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                            You are currently specializing in this field. View your personalized roadmap to stay on track.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(`/student/career/track/${activeTrack.id || activeTrack._id}`)}
                        className="btn"
                        style={{ padding: '16px 48px', borderRadius: '16px', fontWeight: '800', backgroundColor: 'white', color: 'var(--primary)' }}
                    >
                        Review Roadmap
                    </button>
                </div>
            )}

            {/* Search & Tooling */}
            <div style={{ marginBottom: '40px', display: 'flex', gap: '16px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Search for roles (e.g. 'Frontend', 'Data', 'Cloud')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '18px 24px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-soft)',
                            backgroundColor: 'white',
                            fontSize: '16px',
                            outline: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}
                    />
                </div>
            </div>

            {/* Career Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '32px'
            }}>
                {filteredTracks.map(track => {
                    const isSelected = activeTrackId === track.id || activeTrackId === track._id;
                    return (
                        <div
                            key={track.id}
                            className="card"
                            onClick={() => navigate(`/student/career/track/${track.id}`)}
                            style={{
                                padding: '32px',
                                borderRadius: '28px',
                                backgroundColor: 'white',
                                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-soft)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '320px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.05)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: '24px' }}>{track.icon}</div>
                            <h3 style={{
                                fontSize: '22px',
                                fontWeight: '800',
                                color: 'var(--text-main)',
                                marginBottom: '12px'
                            }}>
                                {track.title}
                            </h3>
                            <p style={{
                                fontSize: '15px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.6',
                                marginBottom: '24px',
                                flex: 1
                            }}>
                                {track.description}
                            </p>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '24px',
                                borderTop: '1px solid var(--border-soft)'
                            }}>
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: isSelected ? 'var(--primary)' : 'var(--text-tertiary)'
                                }}>
                                    {isSelected ? '✓ ACTIVE PATH' : 'EXPLORE DETAILS'}
                                </span>
                                <span style={{ color: 'var(--primary)', fontSize: '20px' }}>→</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredTracks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
                    <h3 style={{ fontSize: '24px', color: 'var(--text-main)' }}>No matching careers found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Try searching for a different keyword or tech stack.</p>
                </div>
            )}
        </div>
    );
};

export default CareerHub;
