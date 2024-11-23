const mongoose = require('mongoose');
require('./user'); // Import User model to register it with Mongoose

const songRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    singerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false,
    },
    songTitle: {
        type: String,
        required: false, // Change to false to make it optional
    },
    artist: {
        type: String,
        required: false, // Change to false to make it optional
    },
    recipientName: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    specialRequests: {
        type: String,
    },
    budget: {
        type: Number,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'Pending',
        maxlength: 100,
    },
});

// Indexes for faster querying
songRequestSchema.index({ userId: 1 });
songRequestSchema.index({ singerUserId: 1 });
songRequestSchema.index({ songTitle: 1 }); // Optional field, index it if necessary
songRequestSchema.index({ genre: 1 });
songRequestSchema.index({ budget: 1 });

module.exports = mongoose.models.SongRequest || mongoose.model('song_requests', songRequestSchema);
