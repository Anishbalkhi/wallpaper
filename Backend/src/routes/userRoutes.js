import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { 
  adminController, 
  userController, 
  managerController, 
  getMyProfile 
} from "../controllers/userController.js";

const router = express.Router();

// 👤 Logged-in user’s own profile
router.get("/me", verifyToken, getMyProfile);

// 👑 Admin-only route
router.get("/admin", verifyToken, checkPermission("manage_users"), adminController);

// 👤 Normal user route (example: create post permission)
router.get("/user", verifyToken, checkPermission("create_posts"), userController);

// 👔 Manager-only route
router.get("/manager", verifyToken, checkPermission("approve_post"), managerController);

export default router;
