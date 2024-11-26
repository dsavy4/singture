import axios from 'axios';

// Retrieve the base API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.warn('REACT_APP_API_URL is not defined. Check your environment variables.');
}

// Caching object to store video data in memory
let videoCache = {};

const fetchVideos = async (page = 1, limit = 10) => {
  // Check if the data for the current page is already cached
  if (videoCache[page]) {
    console.log(`Returning cached data for page ${page}`);
    return videoCache[page]; // Return cached data if it exists
  }

  try {
    const response = await axios.get(`${API_URL}/videos/feed`, {
      params: { page, limit },
    });

    // Validate the response data
    if (response && response.data && Array.isArray(response.data)) {
      // Cache the data for the current page
      videoCache[page] = response.data;
      return response.data; // Return the YouTube RSS data
    } else {
      console.error("Invalid response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching YouTube RSS:", error.message);
    return [];
  }
};

export default fetchVideos;
