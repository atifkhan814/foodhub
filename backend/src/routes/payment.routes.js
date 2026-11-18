
import { Router } from "express";
import customerMiddleware from "../middlewares/customer.middleware.js";
import { processDemoPayment } from "../controllers/payment.controller.js";

const router = Router();

// Process a demo payment
router.post("/demo", customerMiddleware, processDemoPayment);

export default router;
