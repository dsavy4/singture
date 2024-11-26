// Homepage.js
import React from 'react';
import SongRequest from './SongRequest';  // Import the SongRequest component
import VideoList from './VideoList';      // Import the VideoList component
import '../styles/homepage.css';                  // Import the Homepage-specific styles

const Homepage = () => {
  return (
    <div className="homepage">
      <h1 className="homepage-title">Welcome to Singture</h1>
      <div className="homepage-content">
        <SongRequest />  {/* Render SongRequest component */}
        <VideoList />    {/* Render VideoList component */}
      </div>
    </div>
  );
};

export default Homepage;
