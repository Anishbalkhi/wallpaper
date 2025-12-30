// src/components/routing/RoleBasedView.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

/*
  RoleBasedView is a small UI convenience. Important: never rely on it
  for security. Backend must enforce permissions.
*/
const RoleBasedView = ({ children, allowedRoles = [], fallback = null }) => {
  const { user } = useAuth();

  if (!user) return fallback;
  return allowedRoles.includes(user.role) ? children : fallback;
};

export default RoleBasedView;
