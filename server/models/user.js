const mongoose = require("mongoose");
const USER_ROLES = require('../constants');  // Import the constants

// Define the schema for a singer
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    hireCount: { type: Number, default: 0 },

    name: {
        default: '',
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    location: {
        type: String,
        default: '',
        maxlength: 100,
    },
    ip: {
        type: String,
        default: '',
        minlength: 3,
        maxlength: 100,
    },
    genres: {
        type: [String], // Array of genres, e.g., ["Pop", "Rock"]
        enum: ['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'R&B', 'Country', 'EDM'], // Enum of genres
        default: [],
    },
    experience: {
        type: String,
        enum: [
            "I'm New",
            "1-2 Years",
            "3-5 Years",
            "5+ Years",
            "Professional Experience"
        ],
        default: "I'm New",
    },
    bio: {
        type: String,
        maxlength: 200,
        default: '',
    },
    profilePicture: {
        type: String, // URL of the image or base64 encoded string
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: [USER_ROLES.SINGER, USER_ROLES.BUYER], 
        default: USER_ROLES.SINGER, // Default role if none is provided
    },

}, { timestamps: true }); // Timestamps to keep track of createdAt and updatedAt

// Export the model

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.models.User || mongoose.model('users', userSchema);
