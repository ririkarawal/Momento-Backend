const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header("Authorization");
    
    // Check if authorization header exists
    if (!authHeader) {
        console.log("No Authorization header found");
        req.user = null; // Set to null instead of undefined
        return next(); // Continue without authentication for routes that don't require it
    }
    
    // Extract the token (remove "Bearer " if present)
    const token = authHeader.startsWith("Bearer ") 
        ? authHeader.substring(7) 
        : authHeader;
    
    if (!token) {
        console.log("No token found in Authorization header");
        req.user = null; // Set to null instead of undefined
        return next(); // Continue without authentication for routes that don't require it
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Set user info in request object
        req.user = decoded;
        
        console.log("Authenticated user:", {
            id: decoded.id,
            username: decoded.username,
            isAdmin: decoded.isAdmin
        });
        
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        req.user = null; // Set to null instead of throwing an error
        next(); // Continue without authentication
    }
};

module.exports = auth;