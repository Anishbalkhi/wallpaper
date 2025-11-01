import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ Signup Controller
export const Signup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body);

    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        msg: "All fields are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        msg: "Password must be at least 6 characters" 
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        msg: "User already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Response without password
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({
        success: true,
        msg: "User created successfully",
        token,
        user: userResponse,
      });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ 
      success: false,
      msg: "Signup failed", 
      error: err.message 
    });
  }
};

// ✅ Login Controller
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        msg: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ 
        success: false,
        msg: "Invalid credentials" 
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        msg: "Invalid credentials" 
      });
    }

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
      profilePic: user.profilePic,
    };

    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        msg: "Login successful",
        token,
        user: userResponse,
      });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ 
      success: false,
      msg: "Login failed", 
      error: err.message 
    });
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
    res.status(200).json({ 
      success: true,
      msg: "Logout successful" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Logout failed", 
      error: err.message 
    });
  }
};