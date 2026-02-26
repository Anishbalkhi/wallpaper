// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (req.cookies?.token) token = req.cookies.token;
    else if (authHeader && authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, msg: "User not found" });

    // BUG 5 FIX: Block suspended users even if they have a valid cookie
    if (user.suspended) {
      return res.status(403).json({ success: false, msg: "Your account has been suspended. Please contact support." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, msg: "Token invalid or expired", error: err.message });
  }
};
