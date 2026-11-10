import express from "express";
import { UserRegister , UserLogin ,UserMe, UserLogout,  AdminLogin} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/admin-login", AdminLogin);
router.get("/me", UserMe);
router.post("/logout", UserLogout);

export default router;
