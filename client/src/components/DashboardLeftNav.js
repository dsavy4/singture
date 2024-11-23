import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import { USER_ROLES } from '../constants/userRoles';
import '../styles/dashboard-left-nav.css';

const DashboardLeftNav = () => { 
    const { userInfo, updateUserInfo } = useAuth(); // Get user role from AuthContext
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [userRole, setUserRole] = useState(null); // Start with null

    // Sync local state with userInfo's role when userInfo changes
    useEffect(() => {

        if (userInfo?.profile.role && userRole !== userInfo.profile.role) {
            setUserRole(userInfo.profile.role); // Only update if role is different from current state
        }
    }, [userInfo, userRole]); // Ensure useEffect triggers when userInfo or userRole changes


    // Handle window resize to update mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Function to update user role and localStorage
    const handleSetRole = (role) => {
        updateUserInfo({ ...userInfo, role: role });
    };
    

    return (
        <div className={`dashboard-left-nav-container ${isMobile ? 'mobile-view' : ''}`}>
            {/* Button Toggle for Customer/Singer */}
            <div className="dashboard-left-nav-button-toggle-container">
                <button
                    className={`dashboard-left-nav-buyer-button ${userRole === USER_ROLES.BUYER ? 'active' : ''}`} 
                    onClick={() => handleSetRole(USER_ROLES.BUYER)} // Update role and localStorage
                >
                    <i className="fas fa-shopping-cart"></i>
                    {!isMobile && <span className="button-label">Customer</span>}
                </button>
                <button
                    className={`dashboard-left-nav-singer-button ${userRole=== USER_ROLES.SINGER ? 'active' : ''}`} 
                    onClick={() => handleSetRole(USER_ROLES.SINGER)} // Update role and localStorage
                >
                    <i className="fas fa-microphone-alt"></i>
                    {!isMobile && <span className="button-label">Singer</span>}
                </button>
            </div>

            {/* Navigation Links */}
            <div className="dashboard-left-nav-nav-links">
                <Link to="/dashboard" className="dashboard-left-nav-nav-link">
                    <i className="fas fa-tachometer-alt"></i>
                    {!isMobile && ' Overview'}
                </Link>
                {userRole === USER_ROLES.SINGER ? (
                    <Link to="/orders" className="dashboard-left-nav-nav-link">
                        <i className="fas fa-music"></i>
                        {!isMobile && ' Song Requests'}
                    </Link>
                ) : (
                    <Link to="/orders" className="dashboard-left-nav-nav-link">
                        <i className="fas fa-box"></i>
                        {!isMobile && ' Orders'}
                    </Link>
                )}
                <Link to="/profile" className="dashboard-left-nav-nav-link">
                    <i className="fas fa-user"></i>
                    {!isMobile && ' Profile'}
                </Link>
                <Link to="/feedback" className="dashboard-left-nav-nav-link">
                    <i className="fas fa-comments"></i>
                    {!isMobile && ' Feedback'}
                </Link>
            </div>
        </div>
    );
};

export default DashboardLeftNav;
