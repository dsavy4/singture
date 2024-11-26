import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // API URL

// Function to submit feedback
export const submitFeedback = async (token, feedbackData) => {
    try {
        const response = await axios.post(
            `${API_URL}/feedback/submit`, // Replace with your actual feedback submission endpoint
            feedbackData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data; // Assuming the API returns a success flag or response data
    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;  // Rethrow to be caught by component
    }
};
