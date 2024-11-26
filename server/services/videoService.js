const axios = require('axios');
const Parser = require('rss-parser'); // For parsing XML
const Video = require('../models/video'); // Import the Video model

const channelId = process.env.YOUTUBE_CHANNEL_ID;
const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

// Function to fetch YouTube RSS feed
const getYouTubeRSS = async () => {
  const parser = new Parser();
  try {
    const response = await axios.get(feedUrl); // Fetch the RSS feed
    const feed = await parser.parseString(response.data); // Parse the XML to JSON

    // Map the RSS feed data to the desired format
    return feed.items.map(item => ({
      videoId: item.id.split(":")[2],  // Extract videoId from the ID
      title: item.title,
      description: item.content || item.description, // Use content if available, otherwise description
      publishedDate: new Date(item.pubDate), // Convert publication date to Date object
      videoUrl: item.link,
      thumbnailUrl: `https://img.youtube.com/vi/${item.id.split(":")[2]}/hqdefault.jpg`, // Thumbnail URL
    }));
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error);
    throw new Error('Error fetching YouTube RSS feed');
  }
};

// Function to save or update a video in MongoDB
const saveVideo = async (videoData) => {
  try {
    const existingVideo = await Video.findOne({ videoId: videoData.videoId });

    if (existingVideo) {
      // Update existing video
      existingVideo.title = videoData.title;
      existingVideo.description = videoData.description;
      existingVideo.publishedDate = videoData.publishedDate;
      existingVideo.videoUrl = videoData.videoUrl;
      existingVideo.thumbnailUrl = videoData.thumbnailUrl;
      await existingVideo.save();
    } else {
      // Create new video
      const newVideo = new Video(videoData);
      await newVideo.save();
    }
  } catch (error) {
    console.error('Error saving video:', error);
  }
};

// Function to fetch and save YouTube videos from RSS feed
const fetchAndSaveYouTubeVideos = async () => {
  console.log('fetchAndSaveYouTubeVideos function is being invoked');
  try {
    const videoData = await getYouTubeRSS();  // Get the videos from YouTube RSS

    // Ensure videoData is an array and has content
    if (!Array.isArray(videoData) || videoData.length === 0) {
      console.error('No video data found.');
      return;
    }

    // Now process the video data and save it to the database
    for (const video of videoData) {
      const { videoId, title, description, publishedDate, videoUrl, thumbnailUrl } = video;
      
      // Create or update the video in the database
      await Video.findOneAndUpdate(
        { videoId },  // Match the video by videoId
        { videoId, title, description, publishedDate, videoUrl, thumbnailUrl },
        { upsert: true }  // Insert if not exists, otherwise update
      );
    }
  } catch (error) {
    console.error("Error fetching or saving YouTube videos:", error);
  }
};

// Export the functions to be used in other files
module.exports = { fetchAndSaveYouTubeVideos, saveVideo, getYouTubeRSS };
