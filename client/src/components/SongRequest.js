import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { submitSongRequest } from '../services/songService';
import '../styles/songrequest.css';
import backgroundImg from '../assets/images/song_request.jpg';

const SongRequest = () => {
    const { userInfo, isAuthenticated, queueSongRequest } = useAuth(); // Get authentication status and queue function
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [recipientName, setRecipientName] = useState('');
    const [genre, setGenre] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [budget, setBudget] = useState('');
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const savedRequest = JSON.parse(localStorage.getItem('songRequest'));
        if (savedRequest) {
            setRecipientName(savedRequest.recipientName || '');
            setGenre(savedRequest.genre || '');
            setSpecialRequests(savedRequest.specialRequests || '');
            setBudget(savedRequest.budget || '');
            setDeadline(savedRequest.deadline || '');
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if user is authenticated
        if (!isAuthenticated) {
            // If not authenticated, queue the song request
            const songRequest = {
                recipientName,
                genre,
                specialRequests,
                budget,
                deadline,
            };
            queueSongRequest(songRequest); // Queue the song request
            navigate('/join'); // Redirect to join page
            return; // Exit the function to prevent further execution
        }

        // Validate form fields
        if (!recipientName || !genre || !budget || !deadline) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const songRequest = {
                recipientName,
                genre,
                specialRequests,
                budget,
                deadline,
            };

            const response = await submitSongRequest(userInfo.token, songRequest);
            if (response.success) {
                console.log('Song request submitted:', response.data);
                localStorage.removeItem('songRequest');
                // Optionally navigate to a confirmation page or reset form
            } else {
                setError(response.message || 'Failed to submit the song request.');
            }
        } catch (error) {
            console.error('Error submitting song request:', error);
            setError('Failed to submit the song request. Please try again later.');
        }
    };

    const handleGenreSelect = (selectedGenre) => {
        setGenre(selectedGenre);
    };

    return (
        <div className="song-request">
            {!showForm ? (
                <div className="song-request-header" style={{ backgroundImage: `url(${backgroundImg})` }}>
                    <div className="header-overlay">
                        <h1 className="song-request-header-title">Create Your Song Request</h1>
                        <p className="song-request-header-text">
                            Tell us what kind of song you need. Customize every detail to make it truly unique.
                        </p>
                        <button
                            className="song-request-start-button"
                            onClick={() => setShowForm(true)}
                        >
                            Start Your Request
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="song-request-container">
                    <h2 className="song-request-title">Fill in the details below to get started with your personalized song</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div style={{ marginTop: '20px' }}>
                        <label>Recipient's Name</label>
                        <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Enter the name of the recipient"
                            className="song-request-input"
                            required
                        />
                        <small className="song-request-small">This is the person the song is dedicated to</small>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label>Music Genre</label>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {['Pop', 'Rock', 'R&B', 'Jazz', 'Country'].map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => handleGenreSelect(g)}
                                    style={{
                                        padding: '10px 15px',
                                        borderRadius: '20px',
                                        border: genre === g ? '2px solid #0178BA' : '1px solid #ddd',
                                        backgroundColor: genre === g ? '#0178BA' : 'white',
                                        color: genre === g ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                        <small className="song-request-small">Select the genre you'd like for your song</small>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label>Special Requests</label>
                        <textarea
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            placeholder="Any specific lyrics or themes you want in the song"
                            className="song-request-textarea"
                        ></textarea>
                        <small className="song-request-small">Let us know your preferences</small>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label>Budget</label>
                        <input
                            type="text"
                            value={budget}
                            onChange={(e) => {
                                // Only update with raw input while typing, allowing numbers and decimals
                                setBudget(e.target.value.replace(/[^0-9.]/g, ''));
                            }}
                            onBlur={() => {
                                // Format the budget when the user leaves the input
                                const numericValue = parseFloat(budget);
                                if (!isNaN(numericValue)) {
                                    const formattedValue = numericValue.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    });
                                    setBudget(formattedValue); // Update with formatted value
                                }
                            }}
                            placeholder="Enter your budget for the song"
                            className="song-request-input"
                            required
                        />
                        <small className="song-request-small">
                            Specify the amount you are willing to spend on the song
                        </small>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label>Deadline</label>
                        <input
                            type="text"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            placeholder="Enter the deadline for the song"
                            className="song-request-input"
                            required
                        />
                        <small className="song-request-small">Specify the timeline for completion</small>
                    </div>                    

                    <button type="submit" className="song-request-button">
                        Submit Song
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="song-request-cancel-button"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

export default SongRequest;
