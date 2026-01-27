import React from 'react';

const ErrorMessage = ({ message, onRetry }) => (
    <div className="card" style={{ borderLeft: '5px solid #dc3545' }}>
        <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>Error</h4>
        <p>{message || 'Something went wrong. Please try again.'}</p>
        {onRetry && (
            <button
                className="btn btn-primary"
                onClick={onRetry}
                style={{ marginTop: '15px' }}
            >
                Retry
            </button>
        )}
    </div>
);

export default ErrorMessage;
