import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ConnectivityManager from './components/Common/ConnectivityManager';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthSuccess from './pages/AuthSuccess';
import AuthError from './pages/AuthError';
import StudentDashboard from './components/Student/StudentDashboard';
import InstructorDashboard from './components/Instructor/InstructorDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import Loading from './components/Common/Loading';

const PrivateRoute = ({ children, role }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <Loading message="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role && user && user.role !== role) {
        return <Navigate to="/login" />;
    }

    return children;
};

function AppRoutes() {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc'
        }}>
            <Loading message="Restoring session..." />
        </div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? (
                        user?.role === 'student' ? <Navigate to="/student" /> :
                            user?.role === 'instructor' ? <Navigate to="/instructor" /> :
                                user?.role === 'admin' ? <Navigate to="/admin" /> :
                                    <Navigate to="/login" />
                    ) : <Login />
                } />
                <Route path="/register" element={<Register />} />

                {/* OAuth Callback Routes */}
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route path="/auth/error" element={<AuthError />} />

                <Route path="/student/*" element={
                    <PrivateRoute role="student">
                        <StudentDashboard />
                    </PrivateRoute>
                } />

                <Route path="/instructor/*" element={
                    <PrivateRoute role="instructor">
                        <InstructorDashboard />
                    </PrivateRoute>
                } />

                <Route path="/admin/*" element={
                    <PrivateRoute role="admin">
                        <AdminDashboard />
                    </PrivateRoute>
                } />

                <Route path="/" element={
                    isAuthenticated ? (
                        user?.role === 'student' ? <Navigate to="/student" /> :
                            user?.role === 'instructor' ? <Navigate to="/instructor" /> :
                                user?.role === 'admin' ? <Navigate to="/admin" /> :
                                    <Navigate to="/login" />
                    ) : <Navigate to="/login" />
                } />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ConnectivityManager />
                <AppRoutes />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
