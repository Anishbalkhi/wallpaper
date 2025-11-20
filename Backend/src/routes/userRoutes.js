import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { 
  adminController, 
  userController, 
  managerController, 
  getMyProfile,
  updateUserRole,
  getAllUsers,
  updateUserStatus,  // NEW: Add this import
  deleteUser,        // NEW: Add this import
  getUserStats       // NEW: Add this import
} from "../controllers/userController.js";
import { uploadProfilePic } from "../controllers/postController.js";
import upload from "../config/multer.js";

const router = express.Router();

// 👤 Logged-in user's own profile
router.get("/me", verifyToken, getMyProfile);

// 👤 Upload profile picture
router.post("/upload-profile-pic", verifyToken, upload.single("file"), uploadProfilePic);

// 👑 Admin-only routes
router.get("/admin", verifyToken, checkPermission("manage_users"), adminController);
router.get("/admin/users", verifyToken, checkPermission("manage_users"), getAllUsers);
router.get("/admin/stats", verifyToken, checkPermission("manage_users"), getUserStats);

// 👤 Normal user route
router.get("/user", verifyToken, checkPermission("create_posts"), userController);

// 👔 Manager-only route  
router.get("/manager", verifyToken, checkPermission("approve_post"), managerController);

// Update user role (admin only)
router.put("/:id/role", verifyToken, checkPermission("manage_users"), updateUserRole);

// User status update (admin only)
router.put("/:id/status", verifyToken, checkPermission("manage_users"), updateUserStatus);

// Delete user (admin only)
router.delete("/:id", verifyToken, checkPermission("manage_users"), deleteUser);

export default router;