import express from "express";
import upload from "../config/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createPost, deletePost, getPosts, downloadPost, purchasePost } from "../controllers/postController.js";

const router = express.Router();

// Remove the duplicate route that was using wrong controller
// Create a post
router.post("/create", verifyToken, upload.single("file"), createPost);

// Delete post
router.delete("/delete/:postId", verifyToken, deletePost);

// Get all posts (public endpoint - no auth required for home page)
router.get("/posts", getPosts);

// Download post
router.get("/:postId/download", verifyToken, downloadPost);

// Purchase post
router.post("/:postId/purchase", verifyToken, purchasePost);

export default router;