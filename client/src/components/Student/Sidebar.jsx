import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SupportModal from '../Common/SupportModal';

function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showSupport, setShowSupport] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkStyle = ({ isActive }) => ({
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: isActive ? '600' : '500',
        transition: 'var(--transition)',
        marginBottom: '6px',
        borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
    });

    const isStudent = user?.role === 'student';
    const isInstructor = user?.role === 'instructor';
    const isAdmin = user?.role === 'admin';

    return (
        <div className="sidebar" style={{
            width: '260px',
            height: '100vh',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-color)',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 20px',
            zIndex: 1000,
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div className="logo" style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--text-main)',
                marginBottom: '48px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingLeft: '4px'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    boxShadow: '0 4px 10px rgba(51, 84, 149, 0.25)'
                }}>G</div>
                GameLearn
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px',
                    paddingLeft: '16px'
                }}>Menu</p>

                {isStudent && (
                    <>
                        <NavLink to="/student" end style={navLinkStyle}>
                            <span>🏠</span> Dashboard
                        </NavLink>
                        <NavLink to="/student/courses" style={navLinkStyle}>
                            <span>📚</span> My Courses
                        </NavLink>
                        <NavLink to="/student/roadmap" style={navLinkStyle}>
                            <span>🚀</span> Roadmap
                        </NavLink>
                        <NavLink to="/student/career" style={navLinkStyle}>
                            <span>🎓</span> Career Exploration
                        </NavLink>
                        <NavLink to="/student/multiplayer" style={navLinkStyle}>
                            <span>⚔️</span> Multiplayer Arena
                        </NavLink>
                    </>
                )}

                {isInstructor && (
                    <>
                        <NavLink to="/instructor" end style={navLinkStyle}>
                            <span>👨‍🏫</span> Panel
                        </NavLink>
                        <NavLink to="/instructor/subjects" style={navLinkStyle}>
                            <span>📖</span> Content
                        </NavLink>
                    </>
                )}

                {isAdmin && (
                    <>
                        <NavLink to="/admin" end style={navLinkStyle}>
                            <span>🛡️</span> Admin
                        </NavLink>
                        <NavLink to="/admin/users" style={navLinkStyle}>
                            <span>👥</span> Users
                        </NavLink>
                        <NavLink to="/admin/stats" style={navLinkStyle}>
                            <span>📈</span> Stats
                        </NavLink>
                    </>
                )}
            </nav>

            <div style={{
                marginTop: 'auto',
                padding: '20px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🎓</span>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>Need assistance?</p>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>Access guides or contact support.</p>
                <button
                    onClick={() => setShowSupport(true)}
                    className="btn btn-secondary"
                    style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '12px',
                    }}
                >Open Support</button>
            </div>

            <button
                onClick={handleLogout}
                style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'var(--transition)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.color = 'var(--text-main)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                <span>🚪</span> Sign Out
            </button>
            <SupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />
        </div>
    );
}

export default Sidebar;



