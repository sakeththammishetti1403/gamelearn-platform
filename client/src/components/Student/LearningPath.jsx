import React from 'react';
import { useNavigate } from 'react-router-dom';

function LearningPath({ path }) {
    const navigate = useNavigate();

    return (
        <section className="fade-in" style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2E3A59' }}>Your Learning Path</h2>
                <button
                    onClick={() => navigate('/student/courses')}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#4F7DF3',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '15px'
                    }}
                >
                    View all courses →
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '24px'
            }}>
                {path.map((subject) => (
                    <div
                        key={subject._id}
                        className="card"
                        onClick={() => navigate(`/student/subject/${subject._id}`)}
                        style={{
                            padding: '0',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: '1px solid #E5E9F2',
                            borderRadius: '24px',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 2px 8px rgba(46, 58, 89, 0.04)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(46, 58, 89, 0.08)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 58, 89, 0.04)';
                        }}
                    >
                        <div style={{
                            height: '160px',
                            position: 'relative',
                            backgroundImage: `url(${subject.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to bottom, transparent, rgba(46, 58, 89, 0.4))'
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '16px',
                                left: '20px',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600',
                                backgroundColor: 'rgba(46, 58, 89, 0.6)',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                backdropFilter: 'blur(4px)'
                            }}>
                                {subject.moduleOrder > 1 ? `Module ${subject.moduleOrder}` : 'New Subject'}
                            </div>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2E3A59', marginBottom: '8px' }}>{subject.title}</h3>
                            <p style={{
                                fontSize: '14px',
                                color: '#7A859E',
                                marginBottom: '20px',
                                height: '40px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {subject.description}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#2E3A59' }}>Progress</span>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#4F7DF3' }}>{subject.progress}%</span>
                            </div>

                            <div style={{
                                height: '6px',
                                backgroundColor: '#E5E9F2',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginBottom: '20px'
                            }}>
                                <div style={{
                                    width: `${subject.progress}%`,
                                    height: '100%',
                                    backgroundColor: '#4F7DF3',
                                    borderRadius: '3px'
                                }} />
                            </div>

                            <div style={{ fontSize: '13px', color: '#7A859E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>Current:</span>
                                <span style={{ color: '#2E3A59', fontWeight: '600' }}>{subject.currentModule}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LearningPath;

