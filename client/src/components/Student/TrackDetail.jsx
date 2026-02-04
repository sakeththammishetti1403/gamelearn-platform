import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from './Career/CareerDataGate';

const TrackDetail = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentTrackDetail: track, enroll, syncing } = useCareer();
    const [selectionStatus, setSelectionStatus] = useState(null); // 'success', 'warning'

    if (!track) return null;

    const isActive = user?.activeCareerTrack?._id === track.id ||
        user?.activeCareerTrack === track.id ||
        user?.activeCareerTrack?.id === track.id;

    const handleEnroll = async () => {
        if (isActive) return;
        const success = await enroll(track.id);
        if (success) {
            setSelectionStatus('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAskTutor = () => {
        navigate('/student/support', {
            state: {
                initialSubject: `Career Guidance - ${track.title}`,
                initialMessage: `I am interested in the ${track.title} path but I have some specific questions regarding...`
            }
        });
    };

    return (
        <div style={{ padding: '0 20px 100px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Navigation Header */}
            <div style={{ padding: '40px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/student/career')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ← Back to Hub
                </button>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/student/career')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Compare with others
                    </button>
                </div>
            </div>

            {selectionStatus === 'success' && (
                <div style={{
                    padding: '20px 32px',
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    borderRadius: '20px',
                    border: '1px solid #a7f3d0',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>🗺️</span>
                        <span style={{ fontWeight: '700' }}>Career guidance activated! Your dashboard now features a recommended learning sequence for {track.title}.</span>
                    </div>
                    <button onClick={() => setSelectionStatus(null)} style={{ background: 'none', border: 'none', color: '#065f46', fontWeight: '800', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            <div style={{
                backgroundColor: 'rgba(79, 125, 243, 0.05)',
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(79, 125, 243, 0.1)',
                marginBottom: '32px',
                color: 'var(--primary)',
                fontSize: '14px',
                fontWeight: '600'
            }}>
                💡 This is a <strong>recommended path</strong> curated by academic experts. It does not restrict your access to other subjects.
            </div>

            {/* Title Section */}
            <section style={{ marginBottom: '60px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '64px' }}>{track.icon}</span>
                    <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em' }}>
                        {track.title}
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                    <span style={{ padding: '8px 16px', backgroundColor: 'var(--bg-app)', color: 'var(--text-secondary)', borderRadius: '12px', fontSize: '14px', fontWeight: '700' }}>
                        Industry: Technology
                    </span>
                    <span style={{ padding: '8px 16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', fontSize: '14px', fontWeight: '700' }}>
                        {track.achievements.companies}
                    </span>
                </div>
            </section>

            {/* 1. Career Overview */}
            <section style={{ marginBottom: '80px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', borderLeft: '4px solid var(--primary)', paddingLeft: '16px' }}>
                    1️⃣ Career Overview
                </h2>
                <div className="card" style={{ padding: '40px', borderRadius: '32px', backgroundColor: 'white', border: '1px solid var(--border-soft)' }}>
                    <p style={{ fontSize: '18px', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '32px' }}>
                        {track.overview.role}
                    </p>
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Daily Responsibilities</h3>
                        <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
                            {track.overview.responsibilities.map((r, i) => (
                                <li key={i} style={{ marginBottom: '12px', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{r}</li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-app)', borderRadius: '20px', borderLeft: '4px solid #f59e0b' }}>
                        <strong style={{ color: '#92400e', display: 'block', marginBottom: '4px' }}>Who is this for?</strong>
                        <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{track.overview.bestFor}</span>
                    </div>
                </div>
            </section>

            {/* 2. Skills You Need */}
            <section style={{ marginBottom: '80px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', borderLeft: '4px solid var(--primary)', paddingLeft: '16px' }}>
                    2️⃣ Suggested Curriculum
                </h2>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginBottom: '24px', paddingLeft: '20px' }}>
                    This track highlights subjects that are particularly beneficial for {track.title} roles.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className="card" style={{ padding: '32px', borderRadius: '28px', backgroundColor: 'white', border: '1px solid var(--border-soft)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', marginBottom: '20px' }}>Core Skills (Must-Have)</h3>
                        {track.skills.core.map((s, i) => (
                            <div key={i} style={{ marginBottom: '16px', borderBottom: '1px solid var(--bg-app)', paddingBottom: '12px' }}>
                                <div style={{ fontWeight: '700', fontSize: '15px' }}>{s.name}</div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-app)', padding: '2px 8px', borderRadius: '4px' }}>Difficulty: {s.difficulty}</span>
                                    <span style={{ fontSize: '11px', color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>Module: {s.mapping}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card" style={{ padding: '32px', borderRadius: '28px', backgroundColor: 'white', border: '1px solid var(--border-soft)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', marginBottom: '20px' }}>Supporting Skills</h3>
                        {track.skills.supporting.map((s, i) => (
                            <div key={i} style={{ marginBottom: '16px', borderBottom: '1px solid var(--bg-app)', paddingBottom: '12px' }}>
                                <div style={{ fontWeight: '700', fontSize: '15px' }}>{s.name}</div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-app)', padding: '2px 8px', borderRadius: '4px' }}>Difficulty: {s.difficulty}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Learning Path Suggestion */}
            <section style={{ marginBottom: '80px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', borderLeft: '4px solid var(--primary)', paddingLeft: '16px' }}>
                    3️⃣ Learning Path Suggestion
                </h2>
                <div style={{ position: 'relative', paddingLeft: '40px' }}>
                    {track.learningPath.map((item, idx) => (
                        <div key={idx} style={{ position: 'relative', marginBottom: '40px' }}>
                            <div style={{
                                position: 'absolute',
                                left: '-40px',
                                top: '0',
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '800',
                                zIndex: 1
                            }}>
                                {idx + 1}
                            </div>
                            {idx !== track.learningPath.length - 1 && (
                                <div style={{ position: 'absolute', left: '-25px', top: '32px', bottom: '-40px', width: '2px', backgroundColor: 'var(--border-soft)' }} />
                            )}
                            <div className="card" style={{ padding: '32px', borderRadius: '28px', backgroundColor: 'white', border: '1px solid var(--border-soft)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>{item.stage} Stage</h3>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-tertiary)' }}>🕒 Est. {item.duration}</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {item.milestones.map((m, i) => (
                                        <span key={i} style={{ padding: '10px 16px', backgroundColor: 'var(--bg-app)', borderRadius: '14px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Career Opportunities */}
            <section style={{ marginBottom: '80px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', borderLeft: '4px solid var(--primary)', paddingLeft: '16px' }}>
                    4️⃣ Career Opportunities
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-soft)' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '12px', marginBottom: '8px' }}>TARGET ROLES</div>
                        <div style={{ fontSize: '16px', fontWeight: '700' }}>{track.opportunities.roles.join(', ')}</div>
                    </div>
                    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-soft)' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '12px', marginBottom: '8px' }}>INTERNSHIP SCOPE</div>
                        <div style={{ fontSize: '16px', fontWeight: '700' }}>{track.opportunities.internships}</div>
                    </div>
                    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-soft)' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '12px', marginBottom: '8px' }}>FREELANCE POTENTIAL</div>
                        <div style={{ fontSize: '16px', fontWeight: '700' }}>{track.opportunities.freelance}</div>
                    </div>
                    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid var(--border-soft)' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '12px', marginBottom: '8px' }}>REMOTE & GLOBAL</div>
                        <div style={{ fontSize: '16px', fontWeight: '700' }}>{track.opportunities.global}</div>
                    </div>
                </div>
            </section>

            {/* 5. What You Can Achieve */}
            <section style={{ marginBottom: '80px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', borderLeft: '4px solid var(--primary)', paddingLeft: '16px' }}>
                    5️⃣ What You Can Achieve
                </h2>
                <div style={{
                    padding: '48px',
                    borderRadius: '32px',
                    backgroundColor: 'var(--text-main)',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>"{track.achievements.title}"</h3>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
                        {track.achievements.growth}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary-light)', letterSpacing: '1px', marginBottom: '8px' }}>COMPANIES HIRING</div>
                            <div style={{ fontSize: '16px', fontWeight: '700' }}>{track.achievements.companies}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Reality Check */}
            <section style={{ marginBottom: '100px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', borderLeft: '4px solid var(--primary)', paddingLeft: '16px' }}>
                    6️⃣ Reality Check
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '24px', backgroundColor: '#fff1f2', borderRadius: '20px', border: '1px solid #fecdd3' }}>
                        <h4 style={{ color: '#be123c', fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>COMMON MISCONCEPTIONS</h4>
                        <p style={{ color: '#881337', fontSize: '15px', lineHeight: '1.5' }}>{track.realityCheck.misconceptions}</p>
                    </div>
                    <div style={{ padding: '24px', backgroundColor: '#fffbeb', borderRadius: '20px', border: '1px solid #fef3c7' }}>
                        <h4 style={{ color: '#b45309', fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>STUDENTS UNDERESTIMATE</h4>
                        <p style={{ color: '#92400e', fontSize: '15px', lineHeight: '1.5' }}>{track.realityCheck.underestimated}</p>
                    </div>
                    <div style={{ padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '20px', border: '1px solid #dcfce7' }}>
                        <h4 style={{ color: '#15803d', fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>WHAT THIS IS NOT</h4>
                        <p style={{ color: '#166534', fontSize: '15px', lineHeight: '1.5' }}>{track.realityCheck.notA}</p>
                    </div>
                </div>
            </section>

            {/* Selection Flow Footer */}
            <section style={{
                padding: '64px',
                borderRadius: '40px',
                backgroundColor: 'var(--bg-app)',
                textAlign: 'center',
                border: '2px solid var(--border-soft)'
            }}>
                <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>Ready to specialize?</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                    Enrolling in this path will <strong>highlight</strong> specialized modules on your dashboard. Remember: true expertise is built on <strong>Core CS Fundamentals</strong> first.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={handleEnroll}
                        disabled={isActive || syncing}
                        style={{
                            padding: '20px 80px',
                            backgroundColor: isActive ? '#10b981' : 'var(--primary)',
                            color: 'white',
                            borderRadius: '24px',
                            fontSize: '20px',
                            fontWeight: '900',
                            border: 'none',
                            cursor: isActive ? 'default' : 'pointer',
                            boxShadow: isActive ? 'none' : '0 12px 30px rgba(51, 84, 149, 0.25)',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isActive ? '✓ Guided Path Active' : syncing ? 'Activating Hub...' : 'Follow This Recommended Path'}
                    </button>
                    {isActive && (
                        <button
                            onClick={() => navigate('/student/career')}
                            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Want to change your path? Just explore and select another one.
                        </button>
                    )}
                </div>
            </section>

            {/* Support Soft Integration */}
            <div style={{ marginTop: '80px', textAlign: 'center', padding: '40px', borderTop: '1px solid var(--border-soft)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Still feeling confused?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Deciding your future is a big step. You can raise a query and a tutor will help you decide.</p>
                <button
                    onClick={handleAskTutor}
                    className="btn btn-outline"
                    style={{ padding: '12px 40px', borderRadius: '12px', fontWeight: '700' }}
                >
                    Ask a Tutor
                </button>
            </div>
        </div>
    );
};

export default TrackDetail;
