import React, { useEffect, useState, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

export const UserContext = createContext<any>(null);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axiosInstance.get('/auth/profile')
            .then(res => {
                setUser(res.data.user);
                setIsAuthenticated(true);
            })
            //@ts-ignore
            .catch(error => {
                setIsAuthenticated(false);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default ProtectedRoute;