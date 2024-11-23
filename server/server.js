// server/server.js

require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users");
const songRoutes = require("./routes/songs");

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment variables to verify they're loaded
console.log("MongoDB URI:", process.env.MONGODB_URI);
console.log("Server Port:", PORT);
console.log("JWT Secret:", process.env.JWT_SECRET); // Add more logging as needed

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.use("/api/users", userRoutes);
app.use("/api/songs", songRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
