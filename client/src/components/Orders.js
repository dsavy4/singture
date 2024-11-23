import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import OrdersBuyer from './OrdersBuyer';
import OrdersSinger from './OrdersSinger';
import DashboardLeftNav from './DashboardLeftNav';
import { USER_ROLES } from '../constants/userRoles';
import '../styles/orders-buyer.css';  // Import Buyer Orders CSS
import '../styles/orders-singer.css'; // Import Singer Orders CSS

const Orders = () => {
    const { isAuthenticated, userInfo } = useAuth();

    return (
        <div className="orders-container">
            <DashboardLeftNav />
            <div className="orders-content">
                {isAuthenticated ? (
                    userInfo?.role === USER_ROLES.BUYER ? (
                        <OrdersBuyer />
                    ) : (
                        <OrdersSinger />
                    )
                ) : (
                    <h2>Please log in to access your orders.</h2>
                )}
            </div>
        </div>
    );
};

export default Orders;
