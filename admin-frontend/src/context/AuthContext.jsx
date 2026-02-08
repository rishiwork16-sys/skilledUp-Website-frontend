import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                // Verify if the user is an admin
                if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ROLE_ADMIN') {
                    // Optionally handle non-admin trying to access admin
                    // But for now we just load the user, the ProtectedRoute in App.jsx handles the redirect
                }
                setUser({ token, role: decoded.role, id: decoded.userId || decoded.id, ...decoded });
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login({ email, password });
        const token = data.token;
        const decoded = JSON.parse(atob(token.split('.')[1]));

        if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ROLE_ADMIN') {
            throw new Error("Access denied. Admin privileges required.");
        }

        setUser({ token, role: decoded.role, id: decoded.userId || decoded.id, ...decoded });
        localStorage.setItem('token', token); // Ensure persistence
        return { ...data, role: decoded.role };
    };

    const register = async (userData) => {
        // Admins might not need register in this context, or maybe they do for creating other admins?
        // Keeping it for now.
        const data = await authService.register(userData);
        // Usually registration doesn't auto-login as admin without approval, but keeping consistent
        // setUser({ token: data.accessToken }); 
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
