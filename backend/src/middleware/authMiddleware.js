// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        // For development - allow all requests
        console.log("Auth middleware - token present:", !!token);
        
        // TODO: Add proper JWT verification in production
        // if (token) {
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //     req.user = decoded;
        // }
        
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        next();
    }
};

export const adminMiddleware = (req, res, next) => {
    try {
        // TODO: Check if user role is admin from JWT token
        console.log("Admin middleware - allowing access");
        next();
    } catch (error) {
        res.status(403).json({ 
            success: false, 
            message: "Admin access required" 
        });
    }
};

// Single default export
export default { authMiddleware, adminMiddleware };