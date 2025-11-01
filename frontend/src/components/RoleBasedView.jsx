import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleBasedView = ({ children, allowedRoles, fallback = null }) => {
  const { user } = useAuth();

  // If no user is logged in, show fallback
  if (!user) {
    return fallback;
  }

  // If user's role is in allowedRoles, show children
  if (allowedRoles.includes(user.role)) {
    return children;
  }

  // Otherwise, show fallback
  return fallback;
};

export default RoleBasedView;