import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSongRequests } from '../services/songService';
import '../styles/orders-buyer.css';
import { FaArrowLeft } from 'react-icons/fa';

const OrdersBuyer = () => {
    const { userInfo } = useAuth();
    const [songRequests, setSongRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [allCounts, setAllCounts] = useState({ Pending: 0, Active: 0, Completed: 0 }); // Persisted counts
    const [counts, setCounts] = useState({ Pending: 0, Active: 0, Completed: 0 }); // Filter-specific counts
    const [showDetails, setShowDetails] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);

    useEffect(() => {
        const loadSongRequests = async () => {
            setLoading(true);

            // Adding the selectedStatus to the filters object for the API request
            const filters = {
                //userId: userInfo?.id,
                role: userInfo?.role,
                page: page,
                limit: 10,
                status: selectedStatus, // Include selected status as a filter
            };

            try {
                const response = await getSongRequests(userInfo?.token, filters);
                if (response.success) {
                    const data = response.data;
                    setSongRequests(page === 1 ? data : [...songRequests, ...data]);

                    // Calculate the counts based on statuses for this page of data
                    const newCounts = { Pending: 0, Active: 0, Completed: 0 };
                    data.forEach((request) => {
                        if (request.status === 'Pending') newCounts.Pending++;
                        if (request.status === 'Active') newCounts.Active++;
                        if (request.status === 'Completed' || new Date(request.deadline) < new Date()) newCounts.Completed++;
                    });

                    // Only update allCounts once on the first page load (page 1)
                    if (page === 1) {
                        setAllCounts((prevCounts) => {
                            return {
                                Pending: newCounts.Pending,
                                Active: newCounts.Active,
                                Completed: newCounts.Completed,
                            };
                        });
                    }

                    // Set the current filter counts based on the selectedStatus
                    setCounts(newCounts);
                }
            } catch (error) {
                console.error('Error fetching song requests:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSongRequests();
    }, [page, selectedStatus, userInfo?.token, userInfo?.id]);

    const handleShowDetails = (request) => {
        setCurrentRequest(request);
        setShowDetails(true);
    };

    const handleBack = () => {
        setShowDetails(false);
        setCurrentRequest(null);
    };

    return (
        <div className="orders-buyer-container">
            {showDetails ? (
                <div className="orders-buyer-details">
                    <div className="orders-buyer-back-button" onClick={handleBack}>
                        <FaArrowLeft /> Back to List
                    </div>
                    <h2>Request Details</h2>
                    <p><strong>Recipient:</strong> {currentRequest?.recipientName}</p>
                    <p><strong>Genre:</strong> {currentRequest?.genre}</p>
                    <p><strong>Budget:</strong> ${currentRequest?.budget}</p>
                    <p><strong>Deadline:</strong> {new Date(currentRequest?.deadline).toLocaleDateString()}</p>
                    <p><strong>Special Requests:</strong> {currentRequest?.specialRequests}</p>
                    <p><strong>Status:</strong> {currentRequest?.status}</p>
                </div>
            ) : (
                <div>
                    {/* Filter container should always show allCounts */}
                    <div className="orders-buyer-filter-container">
                        {Object.keys(allCounts).map((status) => (
                            <div
                                key={status}
                                className={`orders-buyer-filter-item ${selectedStatus === status ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedStatus(status);
                                    setPage(1);  // Reset to page 1 when status changes
                                }}
                            >
                                <span className="orders-buyer-filter-label">{status}</span>
                                <span className="orders-buyer-filter-count">{allCounts[status]}</span>
                            </div>
                        ))}
                    </div>

                    {/* Table to display requests */}
                    <table className="orders-buyer-table">
                        <thead>
                            <tr>
                                <th>Recipient</th>
                                <th>Special Requests</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songRequests.map((request) => (
                                <tr key={request._id} onClick={() => handleShowDetails(request)}>
                                    <td>{request.recipientName}</td>
                                    <td>{request.specialRequests?.substring(0, 100)}...</td>
                                    <td>
                                        <span
                                            className="orders-buyer-view-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShowDetails(request);
                                            }}
                                        >
                                            View Details
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Loading indicator */}
                    {loading && <div>Loading more...</div>}
                </div>
            )}
        </div>
    );
};

export default OrdersBuyer;
