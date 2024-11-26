const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String, unique: true }, // Ensures each video is unique
  title: String,
  description: String,
  publishedDate: Date,
  videoUrl: String,
  thumbnailUrl: String,
});

// Add index on the 'publishedDate' field for better query performance
videoSchema.index({ publishedDate: -1 }); // -1 indicates descending order

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
