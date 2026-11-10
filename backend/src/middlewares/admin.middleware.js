
import User from "../models/User.models.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();

  } catch (error) {
    console.error("Error in admin middleware:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export default adminMiddleware;
