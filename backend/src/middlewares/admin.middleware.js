
import User from "../models/User.models.js";

const adminMiddleware = async (req, res, next) => {
    try {
        // Step 1: Check admin session
        const adminId = req.session.adminUserId;

        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Please login as admin first."
            });
        }

        // Step 2: Verify admin in MongoDB
        const admin = await User.findOne({
            _id: adminId,
            role: "admin"
        }).select("_id role");

        // Step 3: Reject invalid admin sessions
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin session is invalid. Please login again."
            });
        }

        // Step 4: Make verified admin available to controllers
        req.user = admin;

        // Step 5: Allow request to continue
        next();

    } catch (error) {
        console.error("Admin authentication error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

export default adminMiddleware;
