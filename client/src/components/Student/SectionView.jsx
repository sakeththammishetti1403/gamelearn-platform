import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSections, completeContent, submitGame } from '../../services/api';
import ContentView from './ContentView';
import GameView from './GameView';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function SectionView() {
    const { subjectId, moduleId, sectionId } = useParams();
    const [section, setSection] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [sectionId]);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getSections(moduleId);
            setSections(response.data);
            const currentSection = response.data.find(s => s._id === sectionId);
            if (!currentSection) {
                setError('Section not found');
            } else {
                setSection(currentSection);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load section');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        try {
            const response = await completeContent(sectionId);
            const nextId = response.data.nextSectionId;
            if (nextId) {
                navigate(`/student/subject/${subjectId}/module/${moduleId}/section/${nextId}`);
            } else {
                navigate(`/student/subject/${subjectId}/module/${moduleId}`);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to complete section');
        }
    };

    const handleGameSubmit = async (input) => {
        const response = await submitGame(sectionId, input);
        const { result, nextSectionId } = response.data;

        if (result.isPassed) {
            if (nextSectionId) {
                navigate(`/student/subject/${subjectId}/module/${moduleId}/section/${nextSectionId}`);
            } else {
                navigate(`/student/subject/${subjectId}/module/${moduleId}`);
            }
        } else {
            throw new Error(result.feedback);
        }
    };

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Loading section..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadData} /></div>;
    if (!section) return <div style={{ padding: '60px 40px' }}><ErrorMessage message="Section not found" /></div>;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <button
                    onClick={() => navigate(`/student/subject/${subjectId}/module/${moduleId}`)}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#7A859E',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ← Back to Module
                </button>
                <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4F7DF3',
                    backgroundColor: '#EEF2FF',
                    padding: '6px 16px',
                    borderRadius: '20px'
                }}>
                    Section {section.order} of {sections.length}
                </div>
            </div>

            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '32px',
                padding: '48px',
                border: '1px solid #E5E9F2',
                boxShadow: '0 4px 24px rgba(46, 58, 89, 0.04)'
            }}>
                {section.type === 'CONTENT' ? (
                    <ContentView section={section} onComplete={handleComplete} />
                ) : (
                    <GameView section={section} onSubmit={handleGameSubmit} />
                )}
            </div>
        </div>
    );
}

export default SectionView;

