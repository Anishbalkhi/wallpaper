import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (req.cookies?.token) token = req.cookies.token;
    else if (authHeader && authHeader.startsWith("Bearer "))
      token = authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ msg: "Token invalid or expired", error: error.message });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ msg: "Access denied" });
    next();
  };
};
