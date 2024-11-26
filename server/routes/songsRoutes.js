const express = require("express");
const router = express.Router();
const SongRequest = require("../models/songRequest")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); // Make sure to install this package
const authenticateJWT = require("../middleware/authenticateJWT");
const USER_ROLES = require('../constants');  // Import the constants


// Route to submit a new song request
// Route to submit a new song request
router.post('/song-request', async (req, res) => {
    console.log("post /song-request");
    
    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming the format "Bearer <token>"
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        userId = decoded.id; // Get userId from the token
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Extract required data from the request body
    const { recipientName, genre, specialRequests, budget, deadline, singerUserId } = req.body;

    // Validate input fields
    if (!recipientName || !genre || !budget || !deadline) {
        return res.status(400).json({ success: false, message: 'All fields are required: recipientName, genre, budget, deadline, singerUserId.' });
    }

    // Validate budget (ensure it's a valid number)
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue)) {
        return res.status(400).json({ success: false, message: 'Invalid budget value.' });
    }

    // Validate deadline (ensure it's a valid date)
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid deadline date.' });
    }

    // Set expirationTime (e.g., 48 hours after the request creation)
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 48); // Set to 48 hours later

    try {
        // Create a new song request with the provided data
        const newSongRequest = new SongRequest({
            userId,           // Use the userId extracted from the token
            recipientName,    // The recipient's name
            genre,            // The genre of the song request
            specialRequests,  // Any special requests (optional)
            budget: budgetValue,  // The budget for the song request
            deadline: deadlineDate, // The deadline for the song request
            expirationTime,   // Set expiration time (48 hours after request creation)
            ...(singerUserId && { singerUserId }), // Only include singerUserId if it’s defined
        });

        // Save the song request to the database
        await newSongRequest.save();

        // Respond with the success status and the saved song request data
        return res.status(201).json({ success: true, data: newSongRequest });
    } catch (error) {
        console.error('Error saving song request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.get('/song-requests', async (req, res) => {
    const { genre, budget, role, status, page = 1, limit = 10 } = req.query;

    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming the format "Bearer <token>"
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        userId = decoded.id; // Get userId from the token
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    

    // Build the filter object dynamically based on query params
    const filter = {};

    if (userId) {
        if (role === USER_ROLES.BUYER) {
            filter.userId = userId;  // For Buyer, filter by userId (Buyer)
        } else if (role === USER_ROLES.SINGER) {
            filter.$or = [
                { singerUserId: userId },  // Singer's userId
                { status: 'Pending' }      // Status is Pending
            ];
        } else {
            return res.status(400).json({
                success: false,
                message: 'Role must be either "Buyer" or "Singer".',
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: 'userId is required.',
        });
    }

    // Additional filters (genre, budget, status, etc.)
    if (genre) {
        filter.genre = genre;  // Filter by genre if provided
    }

    if (budget) {
        filter.budget = { $lte: parseFloat(budget) };  // Filter by budget, only requests with a budget less than or equal to the provided amount
    }

    if (status) {
        filter.status = status;  // Filter by status if provided
    }

    // Set up pagination: page number and limit of records per page
    const skip = (page - 1) * limit;

    try {
        const songRequests = await SongRequest.find(filter)
            .skip(skip)  // Skip the first N records based on pagination
            .limit(parseInt(limit))  // Limit the number of records per page
            .populate('userId', 'name email')  // Optional: populate the user information (like name and email)
            .populate('singerUserId', 'name email')  // Optional: populate the singer information
            .sort({ requestedAt: -1 });  // Sort by the most recent requests first

        const totalRequests = await SongRequest.countDocuments(filter);  // Total number of requests based on the filter

        // Return the filtered and paginated song requests with total count
        res.json({
            success: true,
            data: songRequests,
            total: totalRequests,
            page: parseInt(page),
            totalPages: Math.ceil(totalRequests / limit),
        });
    } catch (error) {
        console.error("Error retrieving song requests:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});


// Summary of Workflow:
// Singer Accepts: The singer accepts the request and begins working on the song. The status is changed to "In Progress". No payment is released at this point.
// Buyer Approves: The buyer approves the final song, and the status is changed to "Completed". The payment is released to the singer at this point.

// Route for the singer to accept the song request (before completing the song)
router.post('/song-request/:id/accept', authenticateJWT, async (req, res) => {
    const songRequestId = req.params.id;
    const singerId = req.user.id;

    try {
        const songRequest = await SongRequest.findById(songRequestId);

        // Ensure the song request is still pending
        if (songRequest.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'This request cannot be accepted.' });
        }

        // Check if the singer is not the same as the buyer
        if (songRequest.userId.toString() === singerId.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot accept your own request.' });
        }

        // Set the status to 'Accepted' (the singer has accepted the task)
        songRequest.status = 'In Progress'; // Update status to 'In Progress'
        songRequest.singerUserId = singerId;

        await songRequest.save();

        return res.status(200).json({ success: true, data: songRequest });
    } catch (error) {
        console.error('Error accepting song request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route for the buyer to approve the song and release payment
router.post('/song-request/:id/approve', authenticateJWT, async (req, res) => {
    const songRequestId = req.params.id;
    const buyerId = req.user.id;

    try {
        const songRequest = await SongRequest.findById(songRequestId);

        // Ensure the song request exists
        if (!songRequest) {
            return res.status(404).json({ success: false, message: 'Song request not found.' });
        }

        // Ensure the song request is in 'In Progress' status (indicating the singer has delivered the song)
        if (songRequest.status !== 'In Progress') {
            return res.status(400).json({ success: false, message: 'This request cannot be approved at this time.' });
        }

        // Ensure the request belongs to the buyer (the one who created the request)
        if (songRequest.userId.toString() !== buyerId.toString()) {
            return res.status(403).json({ success: false, message: 'Only the buyer can approve the song.' });
        }

        // If the song is approved, set the status to 'Completed' and release the payment
        songRequest.status = 'Completed';
        songRequest.paymentStatus = 'Released'; // Payment is now released to the singer

        // You should trigger your payment provider (e.g., Stripe, PayPal) to release funds here
        // Example: await paymentProvider.releaseFunds(songRequest.userId, songRequest.singerUserId, songRequest.budget);

        await songRequest.save();

        return res.status(200).json({ success: true, message: 'Song approved and payment released.', data: songRequest });
    } catch (error) {
        console.error('Error approving song request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



module.exports = router;
