import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from './Career/CareerDataGate';
import { useTheme } from '../../context/ThemeContext';

const TopHeader = () => {
    const { user, logout } = useAuth();
    const { activeTrack } = useCareer();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <header style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 40px',
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 100,
            width: 'calc(100% - 260px)' // Sidebar width
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        color: 'var(--text-main)',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'var(--transition)'
                    }}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                {/* Profile Controls */}
                <div style={{ position: 'relative' }} ref={menuRef}>
                    <div
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '16px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'var(--transition)'
                        }}
                    >
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '14px'
                        }}>
                            {avatarLetter}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                            {user?.name?.split(' ')[0] || 'Student'}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{isMenuOpen ? '▲' : '▼'}</span>
                    </div>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '50px',
                            right: 0,
                            width: '240px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '20px',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '12px',
                            animation: 'fadeIn 0.2s ease-out forwards',
                            zIndex: 1001
                        }}>
                            <div style={{ padding: '12px', borderBottom: '1px solid var(--border-soft)', marginBottom: '8px' }}>
                                <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-main)', fontSize: '14px' }}>{user?.name || 'Student'}</p>
                                <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '12px' }}>{user?.email || ''}</p>
                                {activeTrack && (
                                    <div style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: 'var(--primary-light)', borderRadius: '6px', fontSize: '11px', color: 'var(--primary)', fontWeight: '700', display: 'inline-block' }}>
                                        {activeTrack.title}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => { navigate('/student/profile'); setIsMenuOpen(false); }}
                                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <span style={{ width: '20px' }}>👤</span> My Profile
                            </button>
                            <button
                                onClick={() => { navigate('/student/profile?tab=progress'); setIsMenuOpen(false); }}
                                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <span style={{ width: '20px' }}>📊</span> My Progress
                            </button>
                            <button
                                onClick={() => { navigate('/student/profile?tab=certificates'); setIsMenuOpen(false); }}
                                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <span style={{ width: '20px' }}>📜</span> Certificates
                            </button>
                            <button
                                onClick={() => { navigate('/student/profile?tab=settings'); setIsMenuOpen(false); }}
                                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <span style={{ width: '20px' }}>⚙️</span> Settings
                            </button>
                            <div style={{ height: '1px', backgroundColor: 'var(--border-soft)', margin: '8px 0' }} />
                            <button
                                onClick={handleLogout}
                                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--status-error)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}
                            >
                                <span>🚪</span> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
