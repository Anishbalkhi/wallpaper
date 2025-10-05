import { useAuth } from "../context/auth";
import { Navigate } from "react-router-dom";

const ROLE_PERMISSIONS = {
  user: ["read_posts", "purchase_posts", "upload_profile_pic", "create_posts", "save_posts"],
  manager: ["read_posts", "create_posts", "edit_posts", "moderate_comments", "upload_profile_pic", "save_posts"],
  admin: ["read_posts", "create_posts", "edit_posts", "delete_posts", "manage_users", "upload_profile_pic", "save_posts"],
};

const ProtectedRoute = ({ children, permission = null }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (permission && !ROLE_PERMISSIONS[user.role]?.includes(permission)) {
    return <div>Access Denied</div>; // or <Navigate to="/unauthorized" replace />
  }

  return children;
};

export default ProtectedRoute;
