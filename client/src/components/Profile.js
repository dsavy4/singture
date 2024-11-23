import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Assuming this hook provides user data and actions
import DashboardLeftNav from './DashboardLeftNav';
import ProfilePictureUpload from './ProfilePictureUpload';
import { USER_ROLES } from '../constants/userRoles';
import '../styles/profile.css';

const Profile = () => {
    const { updateUserInfo, userInfo = {}, token } = useAuth();

    const [userPreferences, setUserPreferences] = useState({
        name: '',
        location: '',
        genres: [],
        experience: '',
        bio: '',
        role: 'Customer',
        profilePicture: null,
    });

    useEffect(() => {
        if (userInfo && userInfo.profile) {
            setUserPreferences({
                name: userInfo.profile.name || '',
                location: userInfo.profile.location || '',
                genres: userInfo.profile.genres || [],
                experience: userInfo.profile.experience || '',
                bio: userInfo.profile.bio || '',
                role: userInfo.profile.role || 'Customer',
                profilePicture: userInfo.profile.profilePicture || null,
            });
            
        } else if (token) {
            const fetchProfileData = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const profileData = response.data.profile;
                    setUserPreferences(profileData);
                    updateUserInfo({ ...userInfo, profile: profileData });
                } catch (error) {
                    console.error('Error fetching profile data', error);
                }
            };
            fetchProfileData();
        }
    }, [userInfo, token, updateUserInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserPreferences((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (role) => setUserPreferences((prev) => ({ ...prev, role }));

    const handleGenreSelect = (genre) => {
        setUserPreferences((prev) => {
            const updatedGenres = prev.genres.includes(genre)
                ? prev.genres.filter((g) => g !== genre)
                : [...prev.genres, genre];
            return { ...prev, genres: updatedGenres };
        });
    };

    const handleExperienceSelect = (experience) => setUserPreferences((prev) => ({ ...prev, experience }));

    const handleProfilePictureChange = (newProfilePictureUrl) => {
        setUserPreferences((prev) => ({ ...prev, profilePicture: newProfilePictureUrl }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/users/profile`,
                userPreferences,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('AAA' + JSON.stringify(response.data));

            updateUserInfo(response.data);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    return (
        <div className="profile-container">
            <DashboardLeftNav />

            <div className="profile-content">
                
                <h2>Profile</h2>

                <div className="profile-section">
                    <ProfilePictureUpload
                        currentPicture={userPreferences.profilePicture}
                        onProfilePictureChange={handleProfilePictureChange}
                    />
                </div>

                <div className="profile-section profile-full-name">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="name"
                        value={userPreferences.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="profile-section profile-location">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={userPreferences.location}
                        onChange={handleInputChange}
                        placeholder="Enter your location"
                    />
                </div>

                <div className="profile-section profile-role">
                    <label>Role</label>
                    <div className="profile-role-buttons">
                        <button
                            className={`profile-role-buttons buyer-button ${userPreferences.role === USER_ROLES.BUYER ? 'active' : ''}`}
                            onClick={() => handleRoleChange(USER_ROLES.BUYER)}
                        >
                            <i className="fas fa-shopping-cart"></i>
                            Customer
                        </button>
                        <button
                            className={`profile-role-buttons singer-button ${userPreferences.role === USER_ROLES.SINGER ? 'active' : ''}`}
                            onClick={() => handleRoleChange(USER_ROLES.SINGER)}
                        >
                            <i className="fas fa-microphone-alt"></i>
                            Singer
                        </button>
                    </div>
                </div>

                <div className="profile-section profile-genres">
                    <label>Genres:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'R&B', 'Country', 'EDM'].map((g) => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => handleGenreSelect(g)}
                                className={userPreferences.genres.includes(g) ? 'selected' : ''}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="profile-section profile-experience">
                    <label>Experience:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['I\'m New', '1-2 Years', '3-5 Years', '5+ Years', 'Professional Experience'].map((exp) => (
                            <button
                                key={exp}
                                type="button"
                                onClick={() => handleExperienceSelect(exp)}
                                className={userPreferences.experience === exp ? 'selected' : ''}
                            >
                                {exp}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="profile-section profile-bio">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={userPreferences.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                    />
                </div>

                <div className="profile-save">
                    <button type="submit" onClick={handleSubmit}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
