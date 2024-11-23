import axios from 'axios';
import { USER_ROLES } from '../constants/userRoles';

const API_URL = process.env.REACT_APP_API_URL; 

// Function to fetch song requests
export const getSongRequests = async (token, filters = {}) => {
    try {
        const response = await axios.get(`${API_URL}/songs/song-requests`, {
            headers: { Authorization: `Bearer ${token}` },
            params: filters
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching song requests:', error);
        throw error;
    }
};

// Function to submit a song request
export const submitSongRequest = async (token, requestData) => {
    try {
        const response = await axios.post(`${API_URL}/songs/song-request`, requestData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting song request:', error);
        throw error;
    }
};

// Accept a song request (only available to singer)
export const acceptSongRequest = async (token, userRole, requestId) => {
    if (userRole !== USER_ROLES.SINGER) {
        console.error('Only singers can accept song requests');
        return;
    }

    if (!token) {
        console.error('No token found, unable to accept request');
        return;
    }

    try {
        return await axios.post(
            `${API_URL}/songs/accept-song-requests`,
            { requestId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        
    } catch (error) {
        console.error('Error accepting song request:', error);
    }
};   

// Additional service functions as needed
