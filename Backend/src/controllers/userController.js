import User from "../models/User.model.js";

export const adminController = (req, res) =>
  res.status(200).json({ msg: "admin" });

export const managerController = (req, res) =>
  res.status(200).json({ msg: "manager" });

export const userController = (req, res) =>
  res.status(200).json({ msg: "user" });

// ✅ Add this function
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user); // send user directly
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch profile", error: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["user", "manager", "admin"].includes(role))
      return res.status(400).json({ msg: "Invalid role" });

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ msg: "Role updated", user: updated });
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};
