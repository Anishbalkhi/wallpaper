import User from "../models/User.model.js";
import Post from "../models/Post.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ 
      success: true, 
      users,
      count: users.length 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to fetch users", 
      error: err.message 
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      user 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to fetch profile", 
      error: err.message 
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!["user", "manager", "admin"].includes(role)) {
      return res.status(400).json({ 
        success: false,
        msg: "Invalid role. Must be: user, manager, or admin" 
      });
    }


if (req.user.role === "admin" && id === req.user._id.toString() && role !== "admin") {
  return res.status(400).json({
    success: false,
    msg: "Admins cannot demote themselves. Ask another admin to change your role."
  });
}


    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      msg: `Role updated to ${role}`, 
      user: updatedUser 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Update failed", 
      error: err.message 
    });
  }
};

export const updateUserStatus = async (req, res) => {
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
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false,
        msg: "Cannot delete your own account" 
      });
    }

    await Post.deleteMany({ author: req.params.id });

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
};

export const getUserStats = async (req, res) => {
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
};