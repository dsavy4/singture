const express = require('express');
const router = express.Router();
const Video = require('../models/video');
const { fetchAndSaveYouTubeVideos } = require('../services/videoService');

// Caching setup (use a more persistent solution like Redis if needed)
let cachedData = {};
let lastFetched = Date.now();
let totalVideos = 0; // Store total video count in the cache

// YouTube route to get the feed with pagination, caching, and error checking
router.get('/feed', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0) {
      return res.status(400).json({ success: false, message: 'Page number must be greater than 0.' });
    }

    if (limit <= 0 || limit > 50) {
      return res.status(400).json({ success: false, message: 'Limit must be greater than 0 and less than or equal to 50.' });
    }

    const skip = (page - 1) * limit;

    // Check cache validity first
    if (isCacheValid()) {
      // If cached data exists for the requested page
      if (cachedData[page]) {
        return res.json(cachedData[page]);
      }
    }

    // If cache is expired or data doesn't exist, fetch and save new data
    await fetchAndSaveYouTubeVideos(); // Fetch and save videos to the database

    // If cache is expired, fetch total video count and videos for the current page
    if (!totalVideos || !isCacheValid()) {
      totalVideos = await Video.countDocuments(); // Cache the total count
    }

    const totalPages = Math.ceil(totalVideos / limit);

    // Validate if requested page exists within the available range
    if (page > totalPages) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. There are only ${totalPages} pages available.`,
      });
    }

    // Fetch the data from the database for the current page
    const savedVideos = await Video.find()
      .sort({ publishedDate: -1 }) // Sort by publishedDate descending
      .skip(skip)
      .limit(limit);

    // Cache the current page and totalVideos count
    cachedData[page] = savedVideos;
    lastFetched = Date.now();

    // Send the requested page as a JSON response
    res.json(savedVideos);
  } catch (error) {
    console.error('Error fetching or saving YouTube RSS feed:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Cache validity check based on time (e.g., 10 minutes)
const isCacheValid = () => {
  return Date.now() - lastFetched < 10 * 60 * 1000; // 10 minutes
};

module.exports = router;
