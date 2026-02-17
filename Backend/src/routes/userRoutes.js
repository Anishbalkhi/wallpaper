import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { 
  getMyProfile,
  updateUserRole,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getUserStats
} from "../controllers/userController.js";
import { uploadProfilePic } from "../controllers/postController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);

router.post("/upload-profile-pic", verifyToken, upload.single("file"), uploadProfilePic);

router.get("/admin/users", verifyToken, checkPermission("manage_users"), getAllUsers);
router.get("/admin/stats", verifyToken, checkPermission("manage_users"), getUserStats);

router.put("/:id/role", verifyToken, checkPermission("manage_users"), updateUserRole);

router.put("/:id/status", verifyToken, checkPermission("manage_users"), updateUserStatus);

router.delete("/:id", verifyToken, checkPermission("manage_users"), deleteUser);

export default router;