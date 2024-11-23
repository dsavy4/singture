import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { getSongRequestById } from '../services/songService'; // Assuming you have this function
import { useNavigate } from 'react-router-dom'; // For navigation in v6
import '../styles/orders-details.css';

const OrdersDetail = ({ match }) => {
    const { userInfo } = useAuth();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            const { orderId } = match.params; // Get orderId from URL params

            try {
                const response = await getSongRequestById(userInfo?.token, orderId);

                if (response.success) {
                    setOrderDetails(response.data);
                } else {
                    setError('Order not found');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Error loading order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [userInfo?.token, match.params]);

    const handleBackToListing = () => {
        navigate('/orders'); // Use navigate to go back to the listing page
    };

    if (loading) return <div className="order-details-loading">Loading...</div>;
    if (error) return <div className="order-details-error">{error}</div>;

    return (
        <div className="order-details-container">
            <h2>Order Details</h2>

            {orderDetails && (
                <>
                    <div className="order-details-info">
                        <p><strong>Recipient:</strong> {orderDetails.recipientName}</p>
                        <p><strong>Genre:</strong> {orderDetails.genre}</p>
                        <p><strong>Budget:</strong> ${orderDetails.budget}</p>
                        <p><strong>Deadline:</strong> {new Date(orderDetails.deadline).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {orderDetails.description}</p>
                    </div>

                    {userInfo?.profile?.role === 'BUYER' && (
                        <div className="order-details-buyer-details">
                            <h3>Buyer-Specific Information</h3>
                            <p>{orderDetails.buyerSpecificInfo}</p>
                        </div>
                    )}

                    {userInfo?.profile?.role === 'SINGER' && (
                        <div className="order-details-singer-details">
                            <h3>Singer-Specific Information</h3>
                            <p>{orderDetails.singerSpecificInfo}</p>
                        </div>
                    )}

                    <div className="order-details-actions">
                        <button className="order-details-ok-button" onClick={handleBackToListing}>
                            OK
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrdersDetail;
