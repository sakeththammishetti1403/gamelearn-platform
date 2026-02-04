import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/socketConfig';
import { useAuth } from '../context/AuthContext';

export const useMultiplayerConnection = () => {
    const { user } = useAuth();
    const [connectionState, setConnectionState] = useState('idle'); // idle, connecting, connected, error
    const [error, setError] = useState('');
    const socketRef = useRef(null);

    const connect = useCallback(() => {
        if (socketRef.current?.connected) return;

        setConnectionState('connecting');
        setError('');

        const socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            query: { name: user?.name || "Student" }
        });

        socket.on('connect', () => {
            console.log("✅ Socket connected to provider:", socket.id);
            setConnectionState('connected');
            setError('');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setConnectionState('error');
            setError('Failed to connect to the Arena. Please check if the server is running.');
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setConnectionState('idle');
        });

        socketRef.current = socket;
    }, [user]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setConnectionState('idle');
        }
    }, []);

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return {
        socket: socketRef.current,
        connectionState,
        error,
        connect,
        disconnect,
        setError
    };
};



