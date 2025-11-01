import User from "../models/User.model.js";

// Get all users (Admin only)
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

export const adminController = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ 
      success: true,
      msg: "Admin access granted", 
      users,
      userCount: users.length 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Admin access failed", 
      error: err.message 
    });
  }
};

export const managerController = (req, res) => {
  res.status(200).json({ 
    success: true,
    msg: "Manager access granted" 
  });
};

export const userController = (req, res) => {
  res.status(200).json({ 
    success: true,
    msg: "User access granted",
    user: req.user 
  });
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
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
    
    // Validate role
    if (!["user", "manager", "admin"].includes(role)) {
      return res.status(400).json({ 
        success: false,
        msg: "Invalid role. Must be: user, manager, or admin" 
      });
    }

    // Prevent self-demotion (admin cannot remove their own admin role)
    if (id === req.user.id && role !== 'admin') {
      return res.status(400).json({ 
        success: false,
        msg: "Cannot remove your own admin privileges" 
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