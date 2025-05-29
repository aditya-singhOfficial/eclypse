import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT and attach user payload to req.user
 * This can be used directly as authenticateToken or aliased as protect.
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        req.user = decoded; // decoded should contain at least { id, role }
        next();
    });
};

// Alias for authenticateToken
export const protect = authenticateToken;

/**
 * Middleware factory to restrict access based on user roles
 * Usage: authorize('admin', 'manager')
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        next();
    };
};
