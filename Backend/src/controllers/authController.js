import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ Signup Controller
export const Signup = async (req, res) => {
  try {
    console.log("Signup request received");

    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Response without password
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    res
      .status(201)
      .json({
        msg: "User created successfully",
        user: userResponse,
      });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ msg: "Signup failed", error: err.message });
  }
};

// ✅ Login Controller
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    // Response without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        msg: "Login successful",
        token,
        user: userResponse,
      });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

// ✅ Logout Controller
export const Logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    res.status(500).json({ msg: "Logout failed", error: err.message });
  }
};
