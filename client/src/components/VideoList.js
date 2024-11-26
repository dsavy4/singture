import '../styles/video-list.css';
import React, { useState, useEffect } from 'react';
import fetchVideos from '../services/videoService';

const VideoList = () => {
  const [videos, setVideos] = useState([]);  // List of videos
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');  // Selected video URL for iframe
  const [currentPage, setCurrentPage] = useState(1);  // Current page number
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [hasMore, setHasMore] = useState(true);  // To track if more videos are available
  const [videoCache, setVideoCache] = useState({});  // Cache to store loaded videos

  // Function to open the modal with the selected video
  const openModal = (url) => {
    setSelectedVideoUrl(url);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideoUrl('');
  };

  // Function to handle clicks outside the modal to close it
  const handleOutsideClick = (e) => {
    if (e.target.className === 'video-list-modal') {
      closeModal();
    }
  };

  // Function to load videos when the page is changed
  useEffect(() => {
    const loadVideos = async () => {
      if (isLoading || !hasMore) return;  // Prevent multiple requests

      setIsLoading(true);  // Set loading state to true

      // Check if data is already cached for the current page
      if (videoCache[currentPage]) {
        console.log(`Using cached data for page ${currentPage}`);
        setVideos((prevVideos) => [...prevVideos, ...videoCache[currentPage]]);
        setIsLoading(false);
        return;
      }

      // Fetch new data from the server
      const videoData = await fetchVideos(currentPage);

      // If no data is returned, mark that there are no more videos
      if (videoData.length === 0) {
        setHasMore(false);  // No more videos available
      } else {
        // Cache the newly fetched data
        setVideoCache((prevCache) => ({
          ...prevCache,
          [currentPage]: videoData,
        }));
        setVideos((prevVideos) => [...prevVideos, ...videoData]);

        // If the number of videos fetched is less than the page size (limit), stop further requests
        if (videoData.length < 10) {  // 10 is the limit per page
          setHasMore(false);  // No more videos to load
        }
      }

      setIsLoading(false);  // Reset loading state after fetch
    };

    loadVideos();
  }, [currentPage]);  // Trigger when the current page changes

  // Scroll handler to detect when the user is near the bottom of the page
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 && !isLoading && hasMore
    ) {
      setCurrentPage((prevPage) => prevPage + 1);  // Load next page when near bottom
    }
  };

  // Add event listener to detect scroll and remove on unmount
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);  // Rerun when loading or hasMore changes

  return (
    <div className="video-list-container">
      {videos.length === 0 && !isLoading && (
        <p>No videos found. Please check back later!</p>
      )}
      
      {videos.map((video) => (
        <div
          className="video-list-item"
          key={video.videoId}
          onClick={() => openModal(`https://www.youtube.com/embed/${video.videoId}?autoplay=1`)}
        >
          <div className="video-list-thumbnail-container">
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
              alt={video.title}
              className="video-list-thumbnail"
            />
          </div>
          <p className="video-list-title">{video.title}</p>
        </div>
      ))}

      {isModalOpen && (
        <div className="video-list-modal" onClick={handleOutsideClick}>
          <div className="video-list-modal-content">
            <button className="video-list-close-btn" onClick={closeModal}>×</button>
            <iframe
              width="100%"
              height="480"
              src={selectedVideoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {isLoading && <p>Loading more videos...</p>}
      
    </div>
  );
};

export default VideoList;
