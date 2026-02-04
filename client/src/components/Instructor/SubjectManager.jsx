import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubjects, createSubject } from '../../services/api';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function SubjectManager() {
    const [subjects, setSubjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getSubjects();
            setSubjects(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createSubject({ title, description });
            setTitle('');
            setDescription('');
            setShowForm(false);
            loadSubjects();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create subject');
        }
    };

    if (loading) return <div className="container"><Loading message="Loading subjects..." /></div>;
    if (error) return <div className="container"><ErrorMessage message={error} onRetry={loadSubjects} /></div>;

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>Manage Subjects</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Create and organize your course content.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Subject'}
                </button>
            </div>

            {showForm && (
                <div className="card fade-in" style={{ marginBottom: '40px', padding: '32px' }}>
                    <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>New Subject</h3>
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Subject Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Advanced Algorithms"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly describe what this subject covers..."
                                style={{ minHeight: '120px' }}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            <button type="submit" className="btn btn-primary">Create Subject</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '24px' }}>
                {subjects.length > 0 ? subjects.map((subject) => (
                    <div key={subject._id} className="card" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '32px'
                    }}>
                        <div style={{ flex: 1, marginRight: '40px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>{subject.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>{subject.description}</p>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/instructor/subject/${subject._id}`)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            Manage Modules →
                        </button>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>No subjects found. Start by creating your first subject!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubjectManager;
