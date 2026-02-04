import React, { useState, useEffect } from 'react';
import { getSubjects, getModules, updateSubjectStatus, updateModuleStatus } from '../../services/api';
import Loading from '../Common/Loading';

function ContentManager() {
    const [subjects, setSubjects] = useState([]);
    const [modules, setModules] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        try {
            const subRes = await getSubjects();
            setSubjects(subRes.data);
            const moduleData = {};
            for (let sub of subRes.data) {
                const modRes = await getModules(sub._id);
                moduleData[sub._id] = modRes.data;
            }
            setModules(moduleData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSubject = async (id, currentStatus) => {
        try {
            await updateSubjectStatus(id, !currentStatus);
            loadAll();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const toggleModule = async (id, currentStatus) => {
        try {
            await updateModuleStatus(id, !currentStatus);
            loadAll();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <Loading message="Loading content status..." />;

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Content Visibility</h3>
            </div>
            <div style={{ padding: '24px', display: 'grid', gap: '20px' }}>
                {subjects.map(subject => (
                    <div key={subject._id} style={{ padding: '16px', backgroundColor: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{subject.title}</h4>
                            <button
                                onClick={() => toggleSubject(subject._id, subject.isActive)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: subject.isActive ? '#FEE2E2' : '#DCFCE7',
                                    color: subject.isActive ? '#991B1B' : '#166534',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                {subject.isActive ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                        <div style={{ display: 'grid', gap: '8px', paddingLeft: '12px', borderLeft: '2px solid var(--border-color)' }}>
                            {modules[subject._id]?.map(module => (
                                <div key={module._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{module.title}</span>
                                    <button
                                        onClick={() => toggleModule(module._id, module.isActive)}
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            backgroundColor: module.isActive ? '#FEE2E2' : '#DCFCE7',
                                            color: module.isActive ? '#991B1B' : '#166534',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {module.isActive ? 'Off' : 'On'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContentManager;
