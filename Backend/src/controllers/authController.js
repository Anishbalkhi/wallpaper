import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  try {
    const { name, email, password, role, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const newUser = new User({ name, email, password, role, bio });
    await newUser.save();

    res.status(201).json({
      msg: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error creating user",
      error: err.message,
    });
  }
};


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ msg: "Invalid email address" });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }


    const token = jwt.sign(
      { id: user._id,
         email: user.email, 
         role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, 
    };

    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
    };

  
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        msg: "Login successful",
        token, 
        user: userResponse,
      });

  } catch (err) {
    return res.status(500).json({ msg: "Error logging in", error: err.message });
  }
};


export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    return res.status(500).json({ msg: "Error logging out", error: err.message });
  }
};
