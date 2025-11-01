import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { 
  adminController, 
  userController, 
  managerController, 
  getMyProfile,
  updateUserRole,
  getAllUsers  // NEW: Add this import
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
router.get("/admin/users", verifyToken, checkPermission("manage_users"), getAllUsers); // NEW: Get all users

// 👤 Normal user route
router.get("/user", verifyToken, checkPermission("create_posts"), userController);

// 👔 Manager-only route  
router.get("/manager", verifyToken, checkPermission("approve_post"), managerController);

// Update user role (admin only)
router.put("/:id/role", verifyToken, checkPermission("manage_users"), updateUserRole);


// User status update
router.put("/:id/status", verifyToken, checkPermission("manage_users"), async (req, res) => {
  try {
    const { suspended } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { suspended },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      msg: `User ${suspended ? 'suspended' : 'activated'}`,
      user: updatedUser 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to update user status", 
      error: err.message 
    });
  }
});

// Delete user
router.delete("/:id", verifyToken, checkPermission("manage_users"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ 
        success: false,
        msg: "Cannot delete your own account" 
      });
    }

    // Delete user's posts (optional - you might want to handle this differently)
    await Post.deleteMany({ author: req.params.id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true,
      msg: "User deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to delete user", 
      error: err.message 
    });
  }
});

// User statistics
router.get("/admin/stats", verifyToken, checkPermission("manage_users"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const managers = await User.countDocuments({ role: 'manager' });
    const users = await User.countDocuments({ role: 'user' });
    const active = await User.countDocuments({ suspended: false });
    const suspended = await User.countDocuments({ suspended: true });

    res.status(200).json({
      success: true,
      stats: {
        total: totalUsers,
        admins,
        managers,
        users,
        active,
        suspended
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to fetch user stats", 
      error: err.message 
    });
  }
});
export default router;