import React, { createContext, useContext, useState, useEffect } from 'react';
import { submitSongRequest } from '../services/songService';

// Create the AuthContext
export const AuthContext = createContext();

// Create a custom provider
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userInfo, setUserInfo] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null; // Directly return the entire user object
    });
    const [songRequests, setSongRequests] = useState([]);
    const [pendingSongRequest, setPendingSongRequest] = useState(null);

    // Effect to update state when localStorage changes
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
    
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser)); // Directly set the full user object
        }
    
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // Login method
    const login = async (userData) => {
        const { token, userInfo } = userData;
    
        setIsAuthenticated(true);
        setToken(token);
        setUserInfo(userInfo);
    
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo)); 
    
        if (pendingSongRequest) {
            try {
                await submitSongRequest(pendingSongRequest);
                setPendingSongRequest(null);
            } catch (error) {
                console.error('Failed to submit song request:', error);
            }
        }
    };

    // Logout method
    const logout = () => {
        setIsAuthenticated(false);
        setUserInfo(null);
        setPendingSongRequest(null);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUserInfo = (updatedUser) => {
        setUserInfo(updatedUser); // Update state with the complete user object
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
    };

    const queueSongRequest = (songRequest) => {
        setPendingSongRequest(songRequest);
        localStorage.setItem('pendingSongRequest', JSON.stringify(songRequest));
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
                userInfo,
                songRequests,
                login,
                logout,
                updateUserInfo,
                queueSongRequest,
                setPendingSongRequest,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the Auth context
export const useAuth = () => useContext(AuthContext);