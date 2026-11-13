
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { processDemoPayment } from "../controllers/payment.controller.js";

const router = Router();

// Process a demo payment
router.post("/demo", authMiddleware, processDemoPayment);

export default router;
