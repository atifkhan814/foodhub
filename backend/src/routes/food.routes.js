
import { Router } from "express";

import {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/food.controller.js";

import upload from "../middlewares/multer.middleware.js";

const router = Router();

// GET /api/foods
router.get("/", getAllFoods);

// POST /api/foods
router.post("/", upload.single("image"), createFood);

// PUT /api/foods/:id
router.put("/:id", upload.single("image"), updateFood);

// DELETE /api/foods/:id
router.delete("/:id", deleteFood);

export default router;
