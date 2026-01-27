import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStudentStats, getLearningPath } from '../../services/api';
import ModuleView from './ModuleView';
import Sidebar from './Sidebar';
import StatsCards from './StatsCards';
import LearningPath from './LearningPath';
import Courses from './Courses';
import Progress from './Progress';
import Reports from './Reports';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

function DashboardHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            const [statsRes, pathRes] = await Promise.all([
                getStudentStats(),
                getLearningPath()
            ]);
            setStats(statsRes.data);
            setPath(pathRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '60px 40px' }}><Loading message="Preparing your dashboard..." /></div>;
    if (error) return <div style={{ padding: '60px 40px' }}><ErrorMessage message={error} onRetry={loadDashboardData} /></div>;

    return (
        <div className="fade-in" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2E3A59', marginBottom: '12px' }}>
                    Welcome back, {user?.name.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: '#7A859E', fontSize: '18px', fontWeight: '400' }}>
                    Continue your learning journey where you left off.
                </p>
            </header>

            {stats && <StatsCards stats={stats} />}
            <LearningPath path={path} />
        </div>
    );
}


function StudentDashboard() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fcfcfc' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '250px' }}>
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/subject/:subjectId/*" element={<ModuleView />} />
                </Routes>
            </main>
        </div>
    );
}

export default StudentDashboard;
