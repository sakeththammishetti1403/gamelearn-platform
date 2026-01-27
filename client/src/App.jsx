import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Student/StudentDashboard';
import InstructorDashboard from './components/Instructor/InstructorDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/login" />;
    }

    return children;
};

function AppRoutes() {
    const { isAuthenticated, user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? (
                        user.role === 'student' ? <Navigate to="/student" /> :
                            user.role === 'instructor' ? <Navigate to="/instructor" /> :
                                user.role === 'admin' ? <Navigate to="/admin" /> :
                                    <Navigate to="/login" />
                    ) : <Login />
                } />
                <Route path="/register" element={<Register />} />

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
                        user.role === 'student' ? <Navigate to="/student" /> :
                            user.role === 'instructor' ? <Navigate to="/instructor" /> :
                                user.role === 'admin' ? <Navigate to="/admin" /> :
                                    <Navigate to="/login" />
                    ) : <Navigate to="/login" />
                } />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
