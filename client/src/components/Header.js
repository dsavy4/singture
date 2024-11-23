import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/header.css';
import logo from '../assets/images/logo.png';
import logoIcon from '../assets/images/logo-icon.png';

const Header = () => {
    const { isAuthenticated, userInfo, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [profileInitial, setProfileInitial] = useState('');

    const dropdownRef = useRef(null);
    const dropdownButtonRef = useRef(null);  // New ref for the profile button
    const navRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (userInfo?.profile?.name) {
            setProfileInitial(userInfo.profile.name[0].toUpperCase());
        }
    }, [userInfo]);

    const toggleDropdown = () => setDropdownOpen(prev => !prev);
    const toggleNav = () => setIsNavOpen(prev => !prev);

    useEffect(() => {
        // Close dropdown and navigation if clicked outside
        const handleClickOutside = (event) => {
            if (
                (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
                (dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target)) &&
                !event.target.closest('.header-profile-container')
            ) {
                setDropdownOpen(false);
                setIsNavOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        console.log("Logging out...");
        logout();
        window.location.reload();
    };

    const closeMenus = (event) => {
        if (event.target.tagName === 'A') {
            event.stopPropagation();
        } else {
            setDropdownOpen(false);
            setIsNavOpen(false);
        }
    };

    return (
        <header className="header">
            {isMobile && (
                <div className="header-hamburger-menu" onClick={toggleNav} ref={navRef}>
                    <div className="header-hamburger-icon"></div>
                    <div className="header-hamburger-icon"></div>
                    <div className="header-hamburger-icon"></div>
                </div>
            )}

            <div className="header-logo-slogan-container">
                <Link to="/">
                    <img src={isMobile ? logoIcon : logo} alt="Logo" className="header-logo-image" />
                </Link>
                <span className="header-slogan">Marketplace for Personalized Songs</span>
            </div>

            {isMobile && isNavOpen && (
                <div className="header-dashboard-left-nav nav-open" onClick={closeMenus}>
                    <Link to="/overview" className="header-dashboard-left-nav-nav-link">Overview</Link>
                    <Link to="/orders" className="header-dashboard-left-nav-nav-link">Orders</Link>
                    <Link to="/profile" className="header-dashboard-left-nav-nav-link">Profile</Link>
                    <Link to="/media" className="header-dashboard-left-nav-nav-link">Media</Link>
                    <Link to="/feedback" className="header-dashboard-left-nav-nav-link">Feedback</Link>
                </div>
            )}

            <div className="header-nav-links">
                {isAuthenticated ? (
                    <div className="header-profile-container" ref={dropdownRef}>
                        <Link to="/dashboard" className="header-nav-link">Dashboard</Link>
                        <div 
                            className="header-profile-circle" 
                            onClick={toggleDropdown} 
                            ref={dropdownButtonRef}  
                        >
                            {profileInitial}
                        </div>
                        {dropdownOpen && (
                            <div className="header-dropdown-menu">
                                <Link to="/dashboard" className="header-menu-item" onClick={closeMenus}>Dashboard</Link>
                                <Link to="/refer-a-friend" className="header-menu-item" onClick={closeMenus}>Refer a Friend</Link>
                                <div className="header-divider"></div>
                                <span className="header-menu-item" onClick={handleLogout}>Log Out</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <nav className="header-auth-links">
                        <Link to="/become-a-singer" className="header-nav-link">Become a Singer</Link>
                        <Link to="/sign-in" className="header-login-button">Sign In</Link>
                        <Link to="/join" className="header-nav-link">Join</Link>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
