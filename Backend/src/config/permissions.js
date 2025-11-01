export const ROLE_PERMISSIONS = {
  user: [
    "read_posts", 
    "purchase_posts", 
    "upload_profile_pic", 
    "create_posts", 
    "save_posts",
    "view_profile"
  ],
  manager: [
    "read_posts", 
    "create_posts", 
    "edit_posts", 
    "moderate_comments", 
    "approve_post", 
    "upload_profile_pic", 
    "save_posts",
    "view_profile",
    "manage_content"
  ],
  admin: [
    "read_posts", 
    "create_posts", 
    "edit_posts", 
    "delete_posts", 
    "manage_users", 
    "upload_profile_pic", 
    "save_posts",
    "view_profile",
    "manage_content",
    "system_settings"
  ]
};