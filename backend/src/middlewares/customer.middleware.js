import User from "../models/User.models.js";

const customerMiddleware = async (req, res, next) => {
    try {
        // Accept userId only for sessions created by the previous customer
        // login flow, then normalize the identity for downstream handlers.
        const customerId = req.session.customerUserId || req.session.userId;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const customer = await User.findOne({
            _id: customerId,
            role: "user"
        }).select("_id role");

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Customer session is invalid. Please login again."
            });
        }

        req.user = customer;
        next();
    } catch (error) {
        console.error("Customer authentication error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default customerMiddleware;
