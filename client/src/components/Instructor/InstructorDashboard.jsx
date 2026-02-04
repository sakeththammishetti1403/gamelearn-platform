import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../Student/Sidebar';
import InstructorModuleView from './InstructorModuleView';
import SubjectManager from './SubjectManager';

function InstructorDashboard() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '260px' }}>
                <Routes>
                    <Route path="/" element={<SubjectManager />} />
                    <Route path="/subjects" element={<SubjectManager />} />
                    <Route path="/subject/:subjectId/*" element={<InstructorModuleView />} />
                </Routes>
            </main>
        </div>
    );
}

export default InstructorDashboard;
