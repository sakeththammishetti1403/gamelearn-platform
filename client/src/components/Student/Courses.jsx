import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearningPath } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Loading courses..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadCourses} /></div>;

    return (
        <div className="fade-in" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2E3A59', marginBottom: '12px' }}>Explore Courses</h1>
                <p style={{ color: '#7A859E', fontSize: '18px' }}>Master new skills with our structured, game-based curriculum.</p>
            </header>

            {courses.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 40px',
                    backgroundColor: '#fff',
                    borderRadius: '24px',
                    border: '1px solid #E5E9F2',
                    boxShadow: '0 2px 8px rgba(46, 58, 89, 0.04)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>📚</div>
                    <h3 style={{ fontSize: '20px', color: '#2E3A59', marginBottom: '12px' }}>No courses available yet</h3>
                    <p style={{ color: '#7A859E' }}>Check back soon for new learning adventures!</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '32px'
                }}>
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="card"
                            onClick={() => navigate(`/student/subject/${course._id}`)}
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
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(46, 58, 89, 0.08)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 58, 89, 0.04)';
                            }}
                        >
                            <div style={{
                                height: '180px',
                                position: 'relative',
                                backgroundImage: `url(${course.image})`,
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
                                    {course.moduleOrder > 1 ? `Module ${course.moduleOrder}` : 'New Course'}
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#2E3A59' }}>{course.title}</h3>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: course.progress === 100 ? '#4CAF50' : '#4F7DF3' }}>
                                        {course.progress}%
                                    </span>
                                </div>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#7A859E',
                                    marginBottom: '24px',
                                    lineHeight: '1.6',
                                    height: '45px',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {course.description}
                                </p>

                                <div style={{
                                    height: '6px',
                                    backgroundColor: '#E5E9F2',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{
                                        width: `${course.progress}%`,
                                        height: '100%',
                                        backgroundColor: course.progress === 100 ? '#4CAF50' : '#4F7DF3',
                                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }} />
                                </div>

                                <button style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: course.progress === 100 ? '#F0FDF4' : '#4F7DF3',
                                    color: course.progress === 100 ? '#166534' : '#fff',
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {course.progress === 100 ? 'Review Course' : course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Courses;
