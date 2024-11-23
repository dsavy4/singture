// Homepage.js
import React from 'react';
import SongRequest from './SongRequest'; // Import the SongRequest component

const Homepage = () => {
    return (
        <div className="homepage">
            <SongRequest /> {/* Render SongRequest directly */}
        </div>
    );
};

export default Homepage;
