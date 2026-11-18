
import { Router } from "express";

import {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/food.controller.js";

import upload from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = Router();

// Public: everyone can view food
router.get("/", getAllFoods);

// Admin only: add food
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createFood);

// Admin only: update food
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateFood);

// Admin only: delete food
router.delete("/:id", authMiddleware, adminMiddleware, deleteFood);

export default router;
