import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        return {
            isAuthenticated: false,
            user: null,
            loading: false,
            loginUser: () => { },
            logout: () => { }
        };
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedUser && storedUser !== 'undefined') {
                    // Pre-emptively set state for better UX
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));

                    // Verify token with backend
                    try {
                        const response = await axios.get(`${API_URL}/auth/me`, {
                            headers: { Authorization: `Bearer ${storedToken}` }
                        });
                        setUser(response.data);
                        localStorage.setItem('user', JSON.stringify(response.data));
                    } catch (err) {
                        console.error('Token verification failed:', err);
                        if (err.response?.status === 401) {
                            logout();
                        }
                    }
                }
            } catch (err) {
                console.error('Auth initialization failed:', err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const loginUser = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(userToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        setUser,
        token,
        loading,
        loginUser,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
