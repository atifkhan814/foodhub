
import express from "express";

import {
    UserRegister,
    UserLogin,
    UserMe,
    UserLogout,
    AdminLogin,
    AdminMe,
    AdminLogout
} from "../controllers/user.controller.js";

const router = express.Router();

// Customer routes
router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/me", UserMe);
router.post("/logout", UserLogout);

// Admin routes
router.post("/admin-login", AdminLogin);
router.get("/admin/me", AdminMe);
router.post("/admin/logout", AdminLogout);

export default router;
