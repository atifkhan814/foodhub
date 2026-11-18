
import User from "../models/User.models.js";

const authMiddleware = async (req, res, next) => {
    try {
        // Preserve the generic guard used by admin routes while recognizing
        // the separate customer and admin session identities.
        const sessionId = req.session.customerUserId || req.session.adminUserId || req.session.userId;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const user = await User.findById(sessionId).select("_id role");

        // Step 3: Reject invalid sessions
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User session is invalid. Please login again."
            });
        }

        // Step 4: Make verified user available to other controllers
        req.user = user;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default authMiddleware;
