import React, { useState } from 'react';

const Documentation = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('guide');

    return (
        <div style={{ padding: '0 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#2E3A59' }}
                >
                    ←
                </button>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#2E3A59' }}>Documentation</h2>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #E5E9F2' }}>
                <button
                    style={{
                        padding: '12px 20px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'guide' ? '2px solid #4F7DF3' : 'none',
                        color: activeTab === 'guide' ? '#4F7DF3' : '#7A859E',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('guide')}
                >
                    User Guide
                </button>
                <button
                    style={{
                        padding: '12px 20px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'faq' ? '2px solid #4F7DF3' : 'none',
                        color: activeTab === 'faq' ? '#4F7DF3' : '#7A859E',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('faq')}
                >
                    FAQs
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                {activeTab === 'guide' ? (
                    <div style={{ color: '#2E3A59' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Getting Started</h3>
                        <p style={{ color: '#7A859E', marginBottom: '24px' }}>
                            Welcome to the Game-Based Learning Platform! Here is how to navigate your learning journey:
                        </p>

                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>1. Choose a Subject</h4>
                            <p style={{ color: '#7A859E', fontSize: '14px' }}>Navigate to the Dashboard or Courses page to see all available subjects. Click on a subject card to enter.</p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>2. Complete Modules</h4>
                            <p style={{ color: '#7A859E', fontSize: '14px' }}>Subjects are divided into Modules. You must complete modules in order. Each module consists of Content sections and Game checkpoints.</p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>3. Play to Learn</h4>
                            <p style={{ color: '#7A859E', fontSize: '14px' }}>After learning a concept, you will face a Game Challenge. You must achieve a passing score to unlock the next section!</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ color: '#2E3A59' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Q: How do I reset my progress?</h4>
                            <p style={{ color: '#7A859E', fontSize: '14px' }}>Currently, progress is permanent to ensure academic integrity. Contact your instructor for special resets.</p>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Q: Why is the next module locked?</h4>
                            <p style={{ color: '#7A859E', fontSize: '14px' }}>You must complete all sections and pass all games in the previous module to unlock the next one.</p>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Q: Can I skip games?</h4>
                            <p style={{ color: '#7A859E', fontSize: '14px' }}>No, games are mandatory assessments designed to reinforce your learning.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Documentation;
