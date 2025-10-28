import express from "express";
import upload from "../config/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadProfilePic, createPost, getMyPosts, deletePost, getPosts, downloadPost, purchasePost } from "../controllers/postController.js";

const router = express.Router();



router.post("/createPost", verifyToken, upload.single("file"),uploadProfilePic);
// Create a post
router.post("/create", verifyToken, upload.single("file"), createPost);

// Delete post
router.delete("/delete/:postId", verifyToken, deletePost);

// Get all posts
router.get("/posts", verifyToken, getPosts);

// Add this to your existing post routes
router.get('/my-posts', verifyToken, getMyPosts);

// Download post
router.get("/:postId/download", verifyToken, downloadPost);

// Purchase post
router.post("/:postId/purchase", verifyToken, purchasePost);

export default router;
