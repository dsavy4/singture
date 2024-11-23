import React, { createContext, useContext, useState, useEffect } from 'react';
import { submitSongRequest } from '../services/songService';

// Create the AuthContext
export const AuthContext = createContext();

// Create a custom provider
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [token, setToken] = useState(localStorage.getItem('token'));
    //const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'customer');
    const [userInfo, setUserInfo] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null; // Directly return the entire user object
    });
    const [songRequests, setSongRequests] = useState([]);
    const [pendingSongRequest, setPendingSongRequest] = useState(null);

    // Effect to update state when localStorage changes
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        //const storedRole = localStorage.getItem('role');
        const storedToken = localStorage.getItem('token');
    
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser)); // Directly set the full user object
        }
    
        //if (storedRole) setUserRole(storedRole);
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
        //setUserRole(role);
        setUserInfo(userInfo);
    
        console.log(userData);
        // Store the entire userInfo object in localStorage
        localStorage.setItem('token', token);
//        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(userInfo)); 
    
        if (pendingSongRequest) {
            await submitSongRequest(pendingSongRequest);
            setPendingSongRequest(null);
        }
    };
    

    // Logout method
    const logout = () => {
        setIsAuthenticated(false);
        //setUserRole(null);
        setUserInfo(null);
        setPendingSongRequest(null);

        localStorage.removeItem('token');
        //localStorage.removeItem('role');
        localStorage.removeItem('user');
    };

const updateUserInfo = (updatedUser) => {
    setUserInfo(updatedUser); // Update state with the complete user object
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
};

    

    // Queue song request for later submission
    const queueSongRequest = (songRequest) => {
        setPendingSongRequest(songRequest);
        localStorage.setItem('pendingSongRequest', JSON.stringify(songRequest));
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
//                userRole,
                pendingSongRequest,
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
