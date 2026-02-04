import React from 'react';

export const CareerLoading = () => (
    <div style={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'var(--bg-app)'
    }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '40px', height: '40px', borderWidth: '3px' }}>
            <span className="visually-hidden">Loading Hub...</span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', marginTop: '24px' }}>Accessing Career Information</h2>
    </div>
);

// This is only shown if a user tries to access a career ID that doesn't exist
export const CareerUnavailable = ({ onRetry }) => (
    <div style={{
        padding: '100px 40px',
        textAlign: 'center',
        borderRadius: '32px',
        margin: '40px'
    }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>📋</div>
        <h2 style={{ fontSize: '26px', color: 'var(--text-main)', marginBottom: '16px', fontWeight: '800' }}>Career Path Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            This career path is not available in our current curriculum or the link is invalid.
        </p>
        <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/student/career'}
            style={{ padding: '14px 48px', borderRadius: '16px', fontWeight: '700' }}
        >
            Explore all Careers
        </button>
    </div>
);

// Empty state is no longer used because the Hub is always available
export const CareerEmptyState = ({ onDiscover }) => null;
