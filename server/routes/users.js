// server/routes/users.js

const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); // Make sure to install this package
const authenticateJWT = require("../middleware/authenticateJWT");

// GET all singers
router.get("/", async (req, res) => {
    try {
        const singers = await User.find();
        res.json(singers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to retrieve singer profile
router.get("/profile", authenticateJWT, async (req, res) => {
    try {
        // Find the singer by ID using the `userId` from JWT
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Singer not found" });
        }

        let fullName = user.name;

        if (!fullName) {
            // Parse the email to create a default full name if user.name is not set
            fullName = user.email.split('@')[0].split('.').map((part, index) => {
                // Capitalize the first letter of each name part (first name, last name)
                return index === 0
                    ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                    : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }).join(' ');
        }

        const profileData = {
            name: fullName,
            location: user.location,
            genres: user.genres,
            experience: user.experience,
            bio: user.bio,
            profilePicture: user.profilePicture,
            phone: user.phone,
            role: user.role,
        };

        res.status(200).json({ profile: profileData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to update singer profile
router.put("/profile", authenticateJWT, async (req, res) => {
    try {
        const { name, location, genres, experience, bio, profilePicture, phone, role } = req.body;

        // Find the singer by ID using the `userId` from JWT
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Singer not found" });
        }

        user.name = name || user.name;
        user.location = location || user.location;
        user.genres = genres || user.genres;
        user.experience = experience || user.experience;
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;
        user.phone = phone || user.phone;
        user.role = role || user.role;

        // Save the updated profile in the database
        await user.save();
        res.status(200).json({ message: "Profile updated successfully", profile: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// Check if email exists
router.get("/check-email/:email", async (req, res) => {
    const { email } = req.params;
    const singer = await User.findOne({ email });
    if (singer) {
        return res.json({ exists: true });
    }
    return res.json({ exists: false });
});

// POST a new singer (register)
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


    // Validate incoming data
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    // Check if email already exists
        const existingSinger = await User.findOne({ email });
    if (existingSinger) {
        console.log('existingSinger: YES');
        const token = jwt.sign({ id: existingSinger._id }, process.env.JWT_SECRET, { expiresIn: '52w' });

        return res.status(201).json({ status: 2, token }); // Email already exist - allow to login        
    }

    console.log('existingSinger: NO');

    var fullName = email.split('@')[0].split('.').map((part, index) => {
        // Capitalize the first letter of each name part (first name, last name)
        return index === 0 
            ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() 
            : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }).join(' ');


    const user = new User({
        name: fullName,
        email,
        ip,
        password, // Hash the password before saving (make sure to implement this)
    });

    console.log('Save - existingSinger === NO');
    try {
        const savedUser = await user.save();

        // Generate a token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '52w' });

        res.status(201).json({ status: 1, token }); // Success and send token
    } catch (err) {
        console.error(err);
        res.status(400).json(0); // Error
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Use name instead of email

    try {
        // Find singer by name
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        //const isMatch = await bcrypt.compare(password, singer.password);
        const isMatch = password == user.password;
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '52w' });
        res.json({
            status: 1,
            token,
            profile: {
                id: user._id,
                email: user.email,  
                name: user.name,    
                fullName: user.fullName,
                location: user.location,
                genres: user.genres,
                experience: user.experience,
                bio: user.bio,
                profilePicture: user.profilePicture,
                phone: user.phone,
                upvotes: user.upvotes,
                downvotes: user.downvotes,
                hireCount: user.hireCount,
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Error during login:', error); // Add this line
        res.status(500).json({ message: 'Server error' });
    }
});


// POST a new singer
router.post("/", async (req, res) => {
    const { name, bio, mediaUrl, email } = req.body;

    // Check if email already exists
    const existingSinger = await User.findOne({ email });
    if (existingSinger) {
        return res.status(400).json(2); // Email already exists
    }

    const user = new User({
        name,
        bio,
        mediaUrl,
        email, // Store the email
    });

    try {
        const savedSinger = await user.save();
        res.status(201).json(1); // Success
    } catch (err) {
        res.status(400).json(0); // Error
    }
});

// PATCH to upvote a singer
router.patch("/:id/upvote", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Singer not found" });
        
        user.upvotes += 1;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH to downvote a singer
router.patch("/:id/downvote", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Singer not found" });
        
        user.downvotes += 1;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH to hire a singer
router.patch("/:id/hire", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Singer not found" });
        
        user.hireCount += 1;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
