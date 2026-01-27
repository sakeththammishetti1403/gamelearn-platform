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
        padding: '14px 20px',
        borderRadius: '16px',
        textDecoration: 'none',
        color: isActive ? '#4F7DF3' : '#7A859E',
        backgroundColor: isActive ? '#EEF2FF' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        fontSize: '15px',
        fontWeight: isActive ? '700' : '500',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        marginBottom: '8px',
        border: isActive ? '1px solid #D1DBFF' : '1px solid transparent'
    });

    const isStudent = user?.role === 'student';
    const isInstructor = user?.role === 'instructor';
    const isAdmin = user?.role === 'admin';

    return (
        <div className="sidebar" style={{
            width: '280px',
            height: '100vh',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #E5E9F2',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 24px',
            zIndex: 1000,
            boxShadow: '4px 0 24px rgba(46, 58, 89, 0.02)'
        }}>
            <div className="logo" style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#2E3A59',
                marginBottom: '56px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                paddingLeft: '8px',
                letterSpacing: '-0.5px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#4F7DF3',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    boxShadow: '0 4px 12px rgba(79, 125, 243, 0.3)'
                }}>G</div>
                GameLearn
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {isStudent && (
                    <>
                        <NavLink to="/student" end style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>🏠</span> Dashboard
                        </NavLink>
                        <NavLink to="/student/courses" style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>📚</span> My Courses
                        </NavLink>
                        <NavLink to="/student/progress" style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>📈</span> Progress
                        </NavLink>
                        <NavLink to="/student/reports" style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>📋</span> Reports
                        </NavLink>
                    </>
                )}

                {isInstructor && (
                    <>
                        <NavLink to="/instructor" end style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>👨‍🏫</span> Instructor Panel
                        </NavLink>
                        <NavLink to="/instructor/subjects" style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>📖</span> Manage Content
                        </NavLink>
                    </>
                )}

                {isAdmin && (
                    <>
                        <NavLink to="/admin" end style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>🛡️</span> Admin Panel
                        </NavLink>
                        <NavLink to="/admin/users" style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>👥</span> User Management
                        </NavLink>
                        <NavLink to="/admin/stats" style={navLinkStyle}>
                            <span style={{ fontSize: '20px' }}>📊</span> System Stats
                        </NavLink>
                    </>
                )}
            </nav>

            <div style={{
                marginTop: 'auto',
                padding: '24px',
                backgroundColor: '#F6F8FC',
                borderRadius: '20px',
                marginBottom: '24px'
            }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#2E3A59', marginBottom: '4px' }}>Need help?</p>
                <p style={{ fontSize: '12px', color: '#7A859E', marginBottom: '12px' }}>Check our documentation</p>
                <button
                    onClick={() => setShowSupport(true)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid #E5E9F2',
                        backgroundColor: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#2E3A59',
                        cursor: 'pointer'
                    }}
                >Support →</button>
            </div>

            <button
                onClick={handleLogout}
                style={{
                    padding: '14px 20px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#7A859E',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    fontWeight: '600',
                    fontSize: '15px',
                    transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF1F2';
                    e.currentTarget.style.color = '#F43F5E';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#7A859E';
                }}
            >
                <span style={{ fontSize: '20px' }}>🚪</span> Logout
            </button>
            <SupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />
        </div>
    );
}

export default Sidebar;



