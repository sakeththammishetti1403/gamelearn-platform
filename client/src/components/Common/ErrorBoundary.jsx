import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container fade-in" style={{
                    padding: '80px 20px',
                    textAlign: 'center',
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="card shadow-lg" style={{
                        maxWidth: '500px',
                        padding: '48px',
                        borderRadius: '32px',
                        border: '1px solid var(--border-soft)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛡️</div>
                        <h2 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '16px' }}>Something went wrong</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px', lineHeight: '1.6' }}>
                            Our mentor system encountered an unexpected academic error. Please refresh the page or return to your dashboard to continue.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => this.resetError()}
                                style={{ padding: '14px', borderRadius: '12px', fontWeight: '700' }}
                            >
                                Try Again
                            </button>
                            <Link
                                to="/student/safe"
                                className="btn btn-secondary"
                                style={{ padding: '14px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}
                                onClick={() => this.resetError()}
                            >
                                Enter Safe Mode
                            </Link>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <details style={{ marginTop: '32px', textAlign: 'left' }}>
                                <summary style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--text-tertiary)' }}>Technical Details</summary>
                                <pre style={{
                                    padding: '16px',
                                    background: 'var(--bg-app)',
                                    borderRadius: '12px',
                                    marginTop: '12px',
                                    fontSize: '11px',
                                    color: 'var(--status-error)',
                                    overflowX: 'auto'
                                }}>
                                    {this.state.error?.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const ErrorBoundaryWrapper = ({ children }) => {
    const { pathname } = useLocation();
    const errorBoundaryRef = React.useRef();

    useEffect(() => {
        if (errorBoundaryRef.current) {
            errorBoundaryRef.current.resetError();
        }
    }, [pathname]);

    return (
        <ErrorBoundary
            ref={errorBoundaryRef}
        >
            {children}
        </ErrorBoundary>
    );
};

export default ErrorBoundaryWrapper;
