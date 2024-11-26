const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        feedback: {
            type: String,
            required: true,
            maxlength: 500, // Max feedback length
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    { timestamps: true } // This will automatically add createdAt and updatedAt
);

feedbackSchema.index({ userId: 1 }); // Indexing userId for faster querying

module.exports = mongoose.models.Feedback || mongoose.model('feedback', feedbackSchema);

