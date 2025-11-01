import { ROLE_PERMISSIONS } from "../config/permissions.js";

export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      // Check if user exists
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          msg: "Authentication required" 
        });
      }

      // Get permissions for user's role
      const rolePermissions = ROLE_PERMISSIONS[req.user.role];
      
      // Check if role exists in permissions config
      if (!rolePermissions) {
        return res.status(403).json({ 
          success: false,
          msg: `No permissions defined for role: ${req.user.role}` 
        });
      }

      // Check if user has required permission
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