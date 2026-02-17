const getSocketUrl = () => {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    return window.location.origin; // Same origin for production
};

export const SOCKET_URL = getSocketUrl();
