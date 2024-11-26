const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    // Extract the token from the "Authorization" header
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    try {
        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object for use in route handlers
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token verification fails, return a 403 (Forbidden) status with a message
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticateJWT;
