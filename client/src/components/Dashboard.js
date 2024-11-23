import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BuyerDashboard from './BuyerDashboard';
import SingerDashboard from './SingerDashboard';
import DashboardLeftNav from './DashboardLeftNav';
import { USER_ROLES } from '../constants/userRoles';
import '../styles/dashboard.css'; 

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userInfo, submitSongRequest, pendingSongRequest } = useAuth();
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/'); // Redirect to login if not authenticated
        } else if (pendingSongRequest) {
            const submitRequest = async () => {
                await submitSongRequest(pendingSongRequest);
            };
            submitRequest();
        }
    }, [isAuthenticated, navigate, pendingSongRequest, submitSongRequest]);

    return (
        <div className="dashboard-container">
            <DashboardLeftNav /> {/* Pass the userRole directly to the left nav */}
            <div className="dashboard-card">
                {isAuthenticated ? (
                    <div className="dashboard-user-info">
                        <h2 className="dashboard-welcome-message">Welcome, {userInfo?.profile?.name || 'User'}!</h2>
                        {/* Render Buyer or Singer dashboard based on userRole */}
                        {userInfo?.profile?.role === USER_ROLES.BUYER ? <BuyerDashboard /> : <SingerDashboard />}
                    </div>
                ) : (
                    <h2>Please log in to access your dashboard.</h2>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
