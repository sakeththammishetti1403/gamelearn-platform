import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/api';
import axios from 'axios';

function AuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const token = searchParams.get('token');

            if (!token) {
                console.error('❌ [AUTH] No token in URL');
                setError('Authentication failed. No token received.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            console.log('✅ [AUTH] Token received from OAuth');

            try {
                // Fetch user data with token
                const response = await axios.get(`${API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const userData = response.data;
                console.log('✅ [AUTH] User data fetched:', userData.name);

                // Store token and user data
                loginUser(userData, token);

                // Redirect based on role
                if (userData.role === 'student') {
                    navigate('/student');
                } else if (userData.role === 'instructor') {
                    navigate('/instructor');
                } else if (userData.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/student');
                }
            } catch (error) {
                console.error('❌ [AUTH] Failed to fetch user data:', error);
                setError('Authentication failed. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleOAuthCallback();
    }, [searchParams, navigate, loginUser]);

    if (error) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center'
            }}>
                <div className="card" style={{ maxWidth: '400px', padding: '48px' }}>
                    <span style={{ fontSize: '64px', display: 'block', marginBottom: '24px' }}>❌</span>
                    <h2 style={{ marginBottom: '16px' }}>Authentication Failed</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                        Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center'
        }}>
            <div className="card" style={{ maxWidth: '400px', padding: '48px' }}>
                <div className="pulse" style={{ fontSize: '64px', marginBottom: '24px' }}>🔐</div>
                <h2 style={{ marginBottom: '16px' }}>Logging you in...</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Please wait while we complete your authentication
                </p>
            </div>
        </div>
    );
}

export default AuthSuccess;
