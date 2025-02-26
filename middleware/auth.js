const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.header("Authorization");
    
    // Check if authorization header exists
    if (!authHeader) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    // Extract the token (remove "Bearer " if present)
    const token = authHeader.startsWith("Bearer ") 
        ? authHeader.substring(7) 
        : authHeader;
    
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
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
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = auth;