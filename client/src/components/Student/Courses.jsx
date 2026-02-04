import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearningPath } from '../../services/api';
import { useCareer } from './Career/CareerDataGate';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { activeTrack } = useCareer();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getLearningPath();
            setCourses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const isRecommended = (courseTitle) => {
        if (!activeTrack) return false;

        const coreMatch = activeTrack.skills.core.some(s =>
            courseTitle.toLowerCase().includes(s.name.toLowerCase()) ||
            (s.mapping && courseTitle.toLowerCase().includes(s.mapping.toLowerCase()))
        );

        const supportMatch = activeTrack.skills.supporting.some(s =>
            courseTitle.toLowerCase().includes(s.name.toLowerCase()) ||
            (s.mapping && courseTitle.toLowerCase().includes(s.mapping.toLowerCase()))
        );

        return coreMatch ? 'core' : (supportMatch ? 'supporting' : null);
    };

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Loading courses..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadCourses} /></div>;

    const coreCourses = courses.filter(c => c.isCore);
    const specCourses = courses.filter(c => !c.isCore);

    return (
        <div className="container fade-in">
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', color: 'var(--text-main)', marginBottom: '12px', fontWeight: '800' }}>Academic Curriculum</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '800px' }}>
                    Access all foundational CS subjects and professional career tracks freely.
                    Choose a career path to get guided recommendations and specialized modules.
                </p>
                {activeTrack && (
                    <div style={{ marginTop: '24px', padding: '16px 24px', backgroundColor: 'var(--primary-light)', borderRadius: '16px', border: '1px dashed var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>🎯</span>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Guidance</div>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>{activeTrack.title} Path</div>
                        </div>
                    </div>
                )}
            </header>

            {courses.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '24px', opacity: 0.8 }}>📚</div>
                    <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>No courses available yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Check back soon for new learning adventures!</p>
                </div>
            ) : (
                <>
                    {/* Section 1: Core CS Foundations */}
                    <section style={{ marginBottom: '64px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '4px', height: '24px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Core Fundamentals</h2>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Universal Computer Science Principles</span>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '32px'
                        }}>
                            {coreCourses.map((course) => <CourseCard key={course._id} course={course} navigate={navigate} isRecommended={isRecommended} />)}
                        </div>
                    </section>

                    {/* Section 2: Professional Specializations */}
                    <section style={{ marginBottom: '64px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '4px', height: '24px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Professional Specializations</h2>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Industry-Aligned Career Tracks</span>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '32px'
                        }}>
                            {specCourses.map((course) => <CourseCard key={course._id} course={course} navigate={navigate} isRecommended={isRecommended} />)}
                            {specCourses.length === 0 && (
                                <p style={{ color: 'var(--text-tertiary)', padding: '20px' }}>Advanced modules are being curated.</p>
                            )}
                        </div>
                        <p style={{ marginTop: '24px', color: 'var(--text-tertiary)', fontSize: '14px', fontStyle: 'italic' }}>
                            Note: All specialization modules are freely accessible. Selecting a career path simply helps organize them into a recommended sequence.
                        </p>
                    </section>
                </>
            )}
        </div>
    );
};

// Internal reusable card component
const CourseCard = ({ course, navigate, isRecommended }) => {
    const recommendation = isRecommended(course.title);
    return (
        <div
            className="card"
            onClick={() => navigate(`/student/subject/${course._id}`)}
            style={{
                padding: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                border: recommendation === 'core' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                transform: recommendation === 'core' ? 'scale(1.02)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <div style={{
                height: '160px',
                position: 'relative',
                backgroundImage: `url(${course.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                }} />

                {recommendation && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: recommendation === 'core' ? 'var(--primary)' : '#10b981',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: '900',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        zIndex: 2
                    }}>
                        {recommendation === 'core' ? 'CORE PATH' : 'SUPPORTING'}
                    </div>
                )}

                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '16px',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backdropFilter: 'blur(2px)'
                }}>
                    {course.isCore ? 'Fundamentals' : 'Specialization'}
                </div>
            </div>
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        {course.title}
                        {course.isCore && <span style={{ marginLeft: '8px', fontSize: '14px' }}>🛡️</span>}
                    </h3>
                </div>
                <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '20px',
                    height: '42px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5'
                }}>
                    {course.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                        flex: 1,
                        height: '6px',
                        backgroundColor: 'var(--bg-app)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${course.progress || 0}%`,
                            height: '100%',
                            backgroundColor: course.progress === 100 ? 'var(--status-success)' : 'var(--primary)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-tertiary)' }}>
                        {course.progress || 0}%
                    </span>
                </div>

                <button
                    className={course.progress > 0 ? "btn btn-primary" : "btn btn-outline"}
                    style={{ width: '100%', borderRadius: '12px', fontWeight: '700' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/student/subject/${course._id}`);
                    }}
                >
                    {course.progress === 100 ? 'Review Module' : course.progress > 0 ? 'Continue Path' : 'Start Learning'}
                </button>
            </div>
        </div>
    );
};

export default Courses;
