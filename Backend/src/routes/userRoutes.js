import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { 
  adminController, 
  userController, 
  managerController, 
  getMyProfile,
  updateUserRole 
} from "../controllers/userController.js";
import { uploadProfilePic } from "../controllers/postController.js"; // Import from correct location
import upload from "../config/multer.js";

const router = express.Router();

// 👤 Logged-in user's own profile
router.get("/me", verifyToken, getMyProfile);

// 👤 Upload profile picture
router.post("/upload-profile-pic", verifyToken, upload.single("file"), uploadProfilePic);

// 👑 Admin-only route
router.get("/admin", verifyToken, checkPermission("manage_users"), adminController);

// 👤 Normal user route
router.get("/user", verifyToken, checkPermission("create_posts"), userController);

// 👔 Manager-only route  
router.get("/manager", verifyToken, checkPermission("approve_post"), managerController);

// Update user role (admin only)
router.put("/:id/role", verifyToken, checkPermission("manage_users"), updateUserRole);

export default router;