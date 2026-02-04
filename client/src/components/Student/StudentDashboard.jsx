import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import Courses from './Courses';
import Roadmap from './Roadmap';
import CareerHub from './CareerHub';
import TrackDetail from './TrackDetail';
import ModuleView from './ModuleView';
import MultiplayerDashboard from '../Multiplayer/MultiplayerDashboard';
import Reports from './Reports';
import TopHeader from './TopHeader';
import SupportPage from './SupportPage';
import { CareerDataGate } from './Career/CareerDataGate';
import ErrorBoundary from '../Common/ErrorBoundary';
import SafeMode from '../Common/SafeMode';
import Loading from '../Common/Loading';

const StudentDashboard = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '40px',
                paddingTop: '80px', // Extra padding for the header
                minHeight: '100vh',
                position: 'relative'
            }}>
                <CareerDataGate>
                    <TopHeader />
                    <Suspense fallback={<Loading message="Initializing module..." />}>
                        <Routes>
                            <Route path="/" element={<DashboardHome />} />
                            <Route path="/courses" element={<ErrorBoundary><Courses /></ErrorBoundary>} />
                            <Route path="/roadmap" element={<ErrorBoundary><Roadmap /></ErrorBoundary>} />

                            {/* Career Exploration Hub (Self-Guided) */}
                            <Route path="/career" element={<ErrorBoundary><CareerHub /></ErrorBoundary>} />
                            <Route path="/career/track/:id" element={<ErrorBoundary><TrackDetail /></ErrorBoundary>} />

                            <Route path="/profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
                            <Route path="/reports" element={<Navigate to="/student/profile?tab=progress" replace />} />
                            <Route path="/multiplayer" element={<ErrorBoundary><MultiplayerDashboard /></ErrorBoundary>} />
                            <Route path="/support" element={<ErrorBoundary><SupportPage /></ErrorBoundary>} />

                            {/* Safe Mode Recovery Path */}
                            <Route path="/safe" element={<SafeMode />} />

                            {/* Learning Content Routes (MUST BE BEFORE FALLBACK) */}
                            <Route path="/subject/:subjectId/*" element={<ErrorBoundary><ModuleView /></ErrorBoundary>} />

                            {/* Fallback - Only for completely unknown student routes */}
                            <Route path="*" element={<Navigate to="/student" replace />} />
                        </Routes>
                    </Suspense>
                </CareerDataGate>
            </main>
        </div>
    );
};

export default StudentDashboard;
