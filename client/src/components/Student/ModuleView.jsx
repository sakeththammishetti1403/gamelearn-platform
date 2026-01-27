import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { getModules, getSections } from '../../services/api';
import SectionView from './SectionView';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function ModuleList({ subjectId }) {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadModules();
    }, [subjectId]);

    const loadModules = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getModules(subjectId);
            setModules(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load modules');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Loading modules..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadModules} /></div>;

    return (
        <div className="fade-in" style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/student')}
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#7A859E',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '15px',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                ← Back to Dashboard
            </button>

            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2E3A59', marginBottom: '12px' }}>Course Modules</h1>
                <p style={{ color: '#7A859E', fontSize: '18px' }}>Follow the structured path to master this subject.</p>
            </header>

            <div style={{ display: 'grid', gap: '20px' }}>
                {modules.map((module) => (
                    <div
                        key={module._id}
                        className="card"
                        style={{
                            cursor: 'pointer',
                            padding: '24px 32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E9F2',
                            borderRadius: '20px',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => navigate(`/student/subject/${subjectId}/module/${module._id}`)}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#4F7DF3';
                            e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#E5E9F2';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: '#EEF2FF',
                                color: '#4F7DF3',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: '700'
                            }}>
                                {module.order}
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2E3A59' }}>{module.title}</h3>
                        </div>
                        <div style={{ color: '#4F7DF3', fontSize: '20px' }}>→</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SectionList() {
    const { subjectId, moduleId } = useParams();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadSections();
    }, [moduleId]);

    const loadSections = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getSections(moduleId);
            setSections(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load sections');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Loading sections..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadSections} /></div>;

    const completedCount = sections.filter(s => s.userStatus === 'COMPLETED').length;
    const progress = sections.length > 0 ? (completedCount / sections.length) * 100 : 0;

    return (
        <div className="fade-in" style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(`/student/subject/${subjectId}`)}
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#7A859E',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '15px',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                ← Back to Modules
            </button>

            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid #E5E9F2',
                marginBottom: '48px',
                boxShadow: '0 2px 8px rgba(46, 58, 89, 0.04)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2E3A59' }}>Module Progress</h3>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#4F7DF3' }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#EEF2FF', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#4F7DF3', transition: 'width 1s ease' }} />
                </div>
                <p style={{ color: '#7A859E', fontSize: '14px' }}>{completedCount} of {sections.length} sections completed</p>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2E3A59', marginBottom: '24px' }}>Sections</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
                {sections.map((section) => {
                    const isLocked = section.userStatus === 'LOCKED';
                    const isCompleted = section.userStatus === 'COMPLETED';

                    return (
                        <div
                            key={section._id}
                            className="card"
                            style={{
                                cursor: isLocked ? 'default' : 'pointer',
                                padding: '24px',
                                opacity: isLocked ? 0.6 : 1,
                                backgroundColor: isCompleted ? '#F0FDF4' : '#FFFFFF',
                                borderColor: isCompleted ? '#DCFCE7' : '#E5E9F2',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => !isLocked && navigate(`/student/subject/${subjectId}/module/${moduleId}/section/${section._id}`)}
                            onMouseOver={(e) => {
                                if (!isLocked) {
                                    e.currentTarget.style.borderColor = isCompleted ? '#4CAF50' : '#4F7DF3';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isLocked) {
                                    e.currentTarget.style.borderColor = isCompleted ? '#DCFCE7' : '#E5E9F2';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: isCompleted ? '#4CAF50' : isLocked ? '#F6F8FC' : '#EEF2FF',
                                color: isCompleted ? 'white' : isLocked ? '#7A859E' : '#4F7DF3',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: '700'
                            }}>
                                {isCompleted ? '✓' : isLocked ? '🔒' : section.order}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#2E3A59', marginBottom: '4px' }}>{section.title}</h3>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#7A859E',
                                        backgroundColor: '#F6F8FC',
                                        padding: '2px 8px',
                                        borderRadius: '6px'
                                    }}>{section.type}</span>
                                    {section.userScore > 0 && (
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#4CAF50' }}>Score: {section.userScore}</span>
                                    )}
                                </div>
                            </div>
                            {!isLocked && <div style={{ color: isCompleted ? '#4CAF50' : '#4F7DF3', fontSize: '18px' }}>→</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ModuleView() {
    return (
        <Routes>
            <Route path="/" element={<ModuleList subjectId={useParams().subjectId} />} />
            <Route path="/module/:moduleId" element={<SectionList />} />
            <Route path="/module/:moduleId/section/:sectionId" element={<SectionView />} />
        </Routes>
    );
}

export default ModuleView;

