import React, { useState, useEffect } from 'react';
import { processSyncQueue } from '../../services/OfflineManager';
import api from '../../services/api';

const ConnectivityManager = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showBanner, setShowBanner] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = async () => {
            setIsOnline(true);
            setShowBanner(true);
            setIsSyncing(true);

            try {
                // Auto-sync
                await processSyncQueue(async (action, data) => {
                    if (action === 'COMPLETE_CONTENT') {
                        await api.post(`/learning/section/${data.sectionId}/complete`);
                    }
                });
            } catch (err) {
                console.error('Auto-sync failed:', err);
            } finally {
                setIsSyncing(false);
                setTimeout(() => setShowBanner(false), 3000);
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showBanner && isOnline) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3000,
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: isOnline ? 'var(--status-success)' : 'var(--status-warning)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-lg)',
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
        }}>
            <span style={{ fontSize: '18px' }}>
                {isOnline ? '✅' : '📡'}
            </span>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>
                {isOnline
                    ? (isSyncing ? 'Syncing progress...' : 'Back online! Progress synced.')
                    : 'You are offline. Progress will be saved locally.'}
            </span>
        </div>
    );
};

export default ConnectivityManager;
