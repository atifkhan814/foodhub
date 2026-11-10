
import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getCustmorOrders } from "../controllers/order.controller.js";
import { getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = Router();

// Place a customer order
router.post("/", authMiddleware, createOrder);

// Get orders of the logged-in customer
router.get("/my-orders", authMiddleware, getCustmorOrders);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
