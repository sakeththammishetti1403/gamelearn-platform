import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { enrollInTrack, getStudentStats } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { CAREER_PATHS } from '../../../data/careerData';

const CareerContext = createContext();

export const useCareer = () => {
    const context = useContext(CareerContext);
    if (!context) {
        console.error('useCareer must be used within a CareerProvider');
        return {}; // Return empty object to avoid crashes
    }
    return context;
};

export const CareerDataGate = ({ children }) => {
    const { user, setUser } = useAuth();
    const { pathname } = useLocation();

    // Data State (Static-First)
    const [tracks] = useState(CAREER_PATHS);
    const [activeTrack, setActiveTrack] = useState(null);
    const [currentTrackDetail, setCurrentTrackDetail] = useState(null);

    // UI State
    const [syncing, setSyncing] = useState(false);

    const resolveData = useCallback(async () => {
        // 1. Resolve Active Track from Static Data based on User ID
        let localActive = null;
        if (user?.activeCareerTrack) {
            const trackId = typeof user.activeCareerTrack === 'object'
                ? user.activeCareerTrack.id || user.activeCareerTrack._id
                : user.activeCareerTrack;

            localActive = CAREER_PATHS.find(t => t.id === trackId);

            if (localActive) {
                // Add _id for component compatibility
                localActive = { ...localActive, _id: localActive.id };

                // MOCK Readiness Score calculation if we have stats
                // In a real scenario, we'd map subject IDs in CAREER_PATHS to user progress
                // For now, let's provide a consistent fallback or calculate if possible
                try {
                    // We could fetch progress here, but for "Always Available" we use a safe default
                    localActive.readinessScore = localActive.readinessScore || 0;
                } catch (e) {
                    localActive.readinessScore = 0;
                }
            }
        }
        setActiveTrack(localActive);

        // 2. Resolve Current Track Detail from Route
        const match = matchPath({ path: '/student/career/track/:id' }, pathname);
        if (match) {
            const detailId = match.params.id;
            let localDetail = CAREER_PATHS.find(t => t.id === detailId);
            if (localDetail) {
                localDetail = { ...localDetail, _id: localDetail.id };

                // Ensure detail is synced with active state
                if (localActive && localActive.id === localDetail.id) {
                    localDetail.readinessScore = localActive.readinessScore;
                }
            }
            setCurrentTrackDetail(localDetail || null);
        } else {
            setCurrentTrackDetail(null);
        }
    }, [user?.activeCareerTrack, pathname]);

    useEffect(() => {
        resolveData();
    }, [resolveData]);

    const handleEnrollAction = async (trackId) => {
        try {
            setSyncing(true);
            // Persistence to backend
            await enrollInTrack(trackId);

            // Immediate local update
            const updatedUser = { ...user, activeCareerTrack: trackId };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return true;
        } catch (err) {
            console.error('Career Selection persistence issue:', err);
            // Local-first: Still update the UI
            const updatedUser = { ...user, activeCareerTrack: trackId };
            setUser(updatedUser);
            return true;
        } finally {
            setSyncing(false);
        }
    };

    const value = {
        tracks: tracks.map(t => ({ ...t, _id: t.id })),
        activeTrack,
        currentTrackDetail,
        syncing,
        enroll: handleEnrollAction,
        refresh: resolveData
    };

    return (
        <CareerContext.Provider value={value}>
            {children}
        </CareerContext.Provider>
    );
};
