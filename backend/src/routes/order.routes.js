
import { Router } from "express";

import {
    createOrder,
    getCustmorOrders,
    getAllOrders,
    updateOrderStatus
} from "../controllers/order.controller.js";

import customerMiddleware from "../middlewares/customer.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = Router();

// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Place a customer order
router.post("/", customerMiddleware, createOrder);

// Get orders of the logged-in customer
router.get("/my-orders", customerMiddleware, getCustmorOrders);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all customer orders
router.get("/", adminMiddleware, getAllOrders);

// Update order status
router.put("/:id/status", adminMiddleware, updateOrderStatus);

export default router;
