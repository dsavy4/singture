import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLeftNav from './DashboardLeftNav';
import { submitFeedback } from '../services/feedbackService';  // Import the feedback service
import '../styles/feedback.css';

const Feedback = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userInfo } = useAuth();

    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            // Validation: Ensure both rating and feedback are provided
            if (!feedback.trim() || rating === 0) {
                setError('Please provide a rating and feedback before submitting.');
                return;
            }

            const feedbackData = { feedback, rating };  // Payload to send

            // Call feedback service to submit feedback
            const response = await submitFeedback(userInfo.token, feedbackData);
            if (response?.success) {
                setSubmitted(true);  // If successful, set submitted state to true
            } else {
                setError('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('Failed to submit feedback. Please try again.');  // Handle error if it occurs
        } finally {
            setLoading(false);  // End the loading state
        }
    };

    // Display thank-you message after successful submission
    if (submitted) {
        return (
            <div className="feedback-container">
                <DashboardLeftNav />
                <div className="feedback-content">
                    <h2 className="feedback-thank-you">Thank You for Your Feedback!</h2>
                    <p className="feedback-message">
                        We really appreciate your feedback and rating. Your input helps us improve our services.
                    </p>
                </div>
            </div>
        );
    }

    // Render the feedback form
    return (
        <div className="feedback-container">
            <DashboardLeftNav />
            <div className="feedback-content">
                <h2 className="feedback-title">Your Feedback Matters to Us</h2>
                <p className="feedback-prompt">We'd love to hear your thoughts about your experience with us.</p>
                <form className="feedback-form" onSubmit={handleSubmit}>
                    <div className="feedback-rating">
                        <p className="feedback-rating-label">Rate Your Experience:</p>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <label
                                key={num}
                                className={`feedback-rating-star ${rating >= num ? 'feedback-rating-star-active' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="rating"
                                    value={num}
                                    onChange={() => setRating(num)}
                                    className="feedback-rating-input"
                                    checked={rating === num}
                                    aria-label={`Rating ${num} star${num > 1 ? 's' : ''}`}
                                />
                                <span className="feedback-rating-icon">★</span>
                            </label>
                        ))}
                    </div>
                    <div className="feedback-textarea">
                        <label htmlFor="feedback" className="feedback-textarea-label">
                            Additional Comments:
                        </label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="feedback-textarea-input"
                            placeholder="Enter your feedback here..."
                            required
                        />
                    </div>
                    {error && <p className="feedback-error">{error}</p>}  {/* Display error message if any */}
                    <button type="submit" className="feedback-submit-button" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
