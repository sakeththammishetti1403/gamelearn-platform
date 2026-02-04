import React from 'react';
import { Link } from 'react-router-dom';

const SafeMode = () => {
    return (
        <div className="container fade-in" style={{ padding: '60px 40px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛡️</div>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)' }}>Platform Safe Mode</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                    You have entered a dependency-free emergency interface.
                </p>
            </header>

            <div className="card shadow-sm" style={{ padding: '40px', borderRadius: '24px', backgroundColor: 'white' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Recovery Options</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <Link to="/student" className="card-link" style={linkStyle}>
                        🏠 Homepage
                    </Link>
                    <Link to="/student/courses" className="card-link" style={linkStyle}>
                        📚 Course Catalog
                    </Link>
                    <Link to="/student/profile" className="card-link" style={linkStyle}>
                        👤 My Profile
                    </Link>
                    <Link to="/student/career" className="card-link" style={linkStyle}>
                        🎓 Career Hub
                    </Link>
                </div>

                <div style={{ marginTop: '40px', padding: '24px', backgroundColor: 'rgba(79, 125, 243, 0.05)', borderRadius: '16px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    <strong>Note:</strong> Safe Mode bypasses complex data gates and background processing. If you are experiencing repeated errors on a specific page, please use the links above to return to a stable part of the application.
                </div>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-outline"
                    style={{ padding: '12px 32px', borderRadius: '12px' }}
                >
                    Hardware Refresh (Hard Reset)
                </button>
            </div>
        </div>
    );
};

const linkStyle = {
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid var(--border-soft)',
    textDecoration: 'none',
    color: 'var(--primary)',
    fontWeight: '700',
    textAlign: 'center',
    display: 'block',
    transition: 'all 0.2s ease',
    backgroundColor: 'var(--bg-app)'
};

export default SafeMode;
