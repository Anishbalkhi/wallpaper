import { ROLE_PERMISSIONS } from "../config/permissions.js";

export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(403).json({ msg: "Not authenticated" });

      const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
      if (!rolePermissions.includes(requiredPermission)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ msg: "Permission check failed", error: error.message });
    }
  };
};
