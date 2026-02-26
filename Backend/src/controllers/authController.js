// src/controllers/authController.js
import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set.");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// Helper: Cookie options (DRY principle)
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
});

// Helper: Format user response (DRY principle)
const formatUserResponse = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  profilePic: user.profilePic || null,
});

export const Signup = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, msg: "Password must be at least 6 characters" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, msg: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role: "user" });

    const token = createToken(newUser._id);
    res.cookie("token", token, getCookieOptions());

    res.status(201).json({ 
      success: true, 
      msg: "User created successfully", 
      user: formatUserResponse(newUser) 
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, msg: "Signup failed", error: err.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    // BUG 4 FIX: Block suspended users from logging in
    if (user.suspended) {
      return res.status(403).json({ success: false, msg: "Your account has been suspended. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({ 
      success: true, 
      msg: "Login successful", 
      user: formatUserResponse(user) 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, msg: "Login failed", error: err.message });
  }
};

export const Logout = (req, res) => {
  const cookieOptions = getCookieOptions();
  // Remove maxAge when clearing cookie
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie("token", clearOptions);
  res.status(200).json({ success: true, msg: "Logout successful" });
};
