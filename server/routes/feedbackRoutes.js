
const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authenticateJWT'); // Authentication middleware

// Route to submit feedback
router.post('/submit', authenticateJWT, async (req, res) => {
    try {
        const { feedback, rating } = req.body;

        // Validate feedback and rating
        if (!feedback || !rating) {
            return res.status(400).json({ success: false, message: 'Feedback and rating are required' });
        }

        // Validate rating is within the range of 1-5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        // Extract the token and verify it
        const token = req.headers['authorization']?.split(' ')[1]; // Assuming format: "Bearer <token>"
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Verify JWT and get the userId from the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log('userId: ' + userId);

        // Create and save the new feedback
        const newFeedback = new Feedback({
            userId,    // Link feedback to the user who provided it
            feedback,  // The feedback content
            rating,    // The rating (1-5)
        });

        await newFeedback.save();

        return res.status(201).json({ success: true, data: newFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to get all feedbacks (optional)
router.get('/list', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'name email'); // Optional: populate user info
        return res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
