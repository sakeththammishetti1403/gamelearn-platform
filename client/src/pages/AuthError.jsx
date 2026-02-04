import React from 'react';
import { useNavigate } from 'react-router-dom';

function AuthError() {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center'
        }}>
            <div className="card" style={{ maxWidth: '500px', padding: '48px' }}>
                <span style={{ fontSize: '80px', display: 'block', marginBottom: '24px' }}>⚠️</span>
                <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Authentication Failed</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
                    We couldn't complete your login. This could be due to:
                </p>
                <ul style={{
                    textAlign: 'left',
                    color: 'var(--text-secondary)',
                    marginBottom: '32px',
                    paddingLeft: '24px'
                }}>
                    <li>Cancelled authorization</li>
                    <li>Invalid OAuth credentials</li>
                    <li>Network connection issues</li>
                </ul>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                    style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700' }}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

export default AuthError;
