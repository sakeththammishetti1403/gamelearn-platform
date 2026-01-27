import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { getModules, createModule, getSections, createSection, updateSection } from '../../services/api';

function ModuleManager({ subjectId }) {
    const [modules, setModules] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [order, setOrder] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        loadModules();
    }, [subjectId]);

    const loadModules = async () => {
        try {
            const response = await getModules(subjectId);
            setModules(response.data);
            setOrder(response.data.length + 1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createModule({ subjectId, title, order });
            setTitle('');
            setShowForm(false);
            loadModules();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create module');
        }
    };

    return (
        <div className="container">
            <button className="btn btn-secondary" onClick={() => navigate('/instructor')} style={{ marginBottom: '20px' }}>
                ← Back to Subjects
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manage Modules</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add Module'}
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <h3>New Module</h3>
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Title</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Order</label>
                            <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-success">Create</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '15px' }}>
                {modules.map((module) => (
                    <div key={module._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>{module.order}. {module.title}</h3>
                        <button className="btn btn-primary" onClick={() => navigate(`/instructor/subject/${subjectId}/module/${module._id}`)}>
                            Manage Sections
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SectionManager() {
    const { subjectId, moduleId } = useParams();
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [type, setType] = useState('CONTENT');
    const [title, setTitle] = useState('');
    const [order, setOrder] = useState(1);
    const [contentText, setContentText] = useState('');
    const [gameType, setGameType] = useState('tic-tac-toe');
    const [gameWord, setGameWord] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [passingScore, setPassingScore] = useState(100);

    const navigate = useNavigate();

    useEffect(() => {
        loadSections();
    }, [moduleId]);

    const loadSections = async () => {
        try {
            const response = await getSections(moduleId);
            setSections(response.data);
            setOrder(response.data.length + 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const data = {
                moduleId,
                type,
                title,
                order,
            };

            if (type === 'CONTENT') {
                data.contentRef = { text: contentText };
            } else {
                data.gameType = gameType;
                data.gameRules = gameType === 'hangman' ? { word: gameWord } : {};
                data.maxScore = maxScore;
                data.passingScore = passingScore;
            }

            await createSection(data);
            resetForm();
            setShowForm(false);
            loadSections();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create section');
        }
    };

    const resetForm = () => {
        setTitle('');
        setContentText('');
        setGameWord('');
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <button className="btn btn-secondary" onClick={() => navigate(`/instructor/subject/${subjectId}`)} style={{ marginBottom: '20px' }}>
                ← Back to Modules
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manage Sections</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add Section'}
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <h3>New Section</h3>
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label>Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="CONTENT">Content</option>
                                <option value="GAME">Game</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Order</label>
                            <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} required />
                        </div>

                        {type === 'CONTENT' ? (
                            <div className="form-group">
                                <label>Text Content</label>
                                <textarea value={contentText} onChange={(e) => setContentText(e.target.value)} required />
                            </div>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>Game Type</label>
                                    <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
                                        <option value="tic-tac-toe">Tic Tac Toe</option>
                                        <option value="hangman">Hangman</option>
                                    </select>
                                </div>
                                {gameType === 'hangman' && (
                                    <div className="form-group">
                                        <label>Target Word</label>
                                        <input value={gameWord} onChange={(e) => setGameWord(e.target.value)} required />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Max Score</label>
                                    <input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Passing Score</label>
                                    <input type="number" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} required />
                                </div>
                            </>
                        )}
                        <button type="submit" className="btn btn-success">Create</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '15px' }}>
                {sections.map((section) => (
                    <div key={section._id} className="card">
                        <h3>{section.order}. {section.title} ({section.type})</h3>
                        {section.type === 'GAME' && <p>Game: {section.gameConfig?.gameType}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function InstructorModuleView() {
    const { subjectId } = useParams();

    return (
        <Routes>
            <Route path="/" element={<ModuleManager subjectId={subjectId} />} />
            <Route path="/module/:moduleId" element={<SectionManager />} />
        </Routes>
    );
}

export default InstructorModuleView;
