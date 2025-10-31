export const ROLE_PERMISSIONS = {
  user: ["read_posts", "purchase_posts", "upload_profile_pic", "create_posts", "save_posts"],
  manager: [
    "read_posts",
    "create_posts",
    "edit_posts",
    "moderate_comments",
    "upload_profile_pic", 
    "save_posts",
    "approve_post" // Added missing permission
  ],
  admin: [
    "read_posts",
    "create_posts",
    "edit_posts",
    "delete_posts", 
    "manage_users",
    "upload_profile_pic",
    "save_posts"
  ]
};