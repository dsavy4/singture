import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { getSongRequests } from '../services/songService';
import { USER_ROLES } from '../constants/userRoles';
import '../styles/dashboard-singer.css';

const DashboardSinger = () => {
    const { userInfo } = useAuth();
    const [songRequests, setSongRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const loadSongRequests = async () => {
            setLoading(true);

            const filters = {
                userId: userInfo?.profile?.id,
                role: userInfo?.profile?.role,
                page: page,
                limit: 10,
            };

            try {
                const response = await getSongRequests(userInfo?.token, filters);
                if (response.success) {
                    setSongRequests((prevRequests) =>
                        page === 1 ? response.data : [...prevRequests, ...response.data]
                    );
                    setHasMore(response.page < response.totalPages);
                }
            } catch (error) {
                console.error('Error fetching song requests:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSongRequests();
    }, [page, userInfo?.token, userInfo?.profile?.id]);

    return (
        <div className="dashboard-singer-section">
            <h2>Your Song Requests</h2>
            <table className="dashboard-singer-table">
                <thead>
                    <tr>
                        <th>Buyer</th>
                        <th>Genre</th>
                        <th>Budget</th>
                        <th>Deadline</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {songRequests.map((request) => (
                        <tr key={request._id}>
                            <td>{request.buyerName}</td>
                            <td>{request.genre}</td>
                            <td>${request.budget}</td>
                            <td>{new Date(request.deadline).toLocaleDateString()}</td>
                            <td>
                                <button className="orders-accept-button">
                                    Accept Request
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <div>Loading more...</div>}
            {!loading && hasMore && (
                <div
                    className="orders-load-more"
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                >
                    Load More
                </div>
            )}
        </div>
    );
};

export default DashboardSinger;
