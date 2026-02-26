import User from "../models/User.model.js";
import Post from "../models/Post.model.js";

// BUG 3 FIX: Persist profile changes to DB
export const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, location, phone, website, instagram, twitter } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (website !== undefined) updates.website = website.trim();
    if (instagram !== undefined) updates.instagram = instagram.trim();
    if (twitter !== undefined) updates.twitter = twitter.trim();

    if (updates.name && updates.name.length < 3) {
      return res.status(400).json({ success: false, msg: "Name must be at least 3 characters" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, msg: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to update profile", error: err.message });
  }
};

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