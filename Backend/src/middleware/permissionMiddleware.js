import { ROLE_PERMISSIONS } from "../config/permissions.js";

export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          msg: "Authentication required" 
        });
      }

      const rolePermissions = ROLE_PERMISSIONS[req.user.role];
      
      if (!rolePermissions) {
        return res.status(403).json({ 
          success: false,
          msg: `No permissions defined for role: ${req.user.role}` 
        });
      }

      if (!rolePermissions.includes(requiredPermission)) {
        return res.status(403).json({ 
          success: false,
          msg: `Access denied. Required permission: ${requiredPermission}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        success: false,
        msg: "Permission check failed", 
        error: error.message 
      });
    }
  };
};