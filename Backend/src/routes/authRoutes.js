import { Router } from "express";
import { Signup } from "../controllers/authController.js";
import { Login } from "../controllers/authController.js";
import { Logout } from "../controllers/authController.js";
const router = Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

export default router;