import React from 'react';

function ContentView({ section, onComplete }) {
    return (
        <div className="fade-in">
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#2E3A59', marginBottom: '24px' }}>{section.title}</h2>

            <div style={{
                marginTop: '32px',
                marginBottom: '48px',
                color: '#2E3A59',
                fontSize: '17px',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap'
            }}>
                {section.contentRef?.text || 'No content available'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {section.userStatus !== 'COMPLETED' ? (
                    <button
                        className="btn btn-primary"
                        onClick={onComplete}
                        style={{ padding: '14px 32px', fontSize: '16px' }}
                    >
                        Complete Section
                    </button>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#4CAF50',
                        fontWeight: '600',
                        fontSize: '16px',
                        backgroundColor: '#F0FDF4',
                        padding: '12px 24px',
                        borderRadius: '12px'
                    }}>
                        <span>✓</span> Section Completed
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContentView;

