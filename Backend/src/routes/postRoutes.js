import express from "express";
import upload from "../config/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createPost, deletePost, getPosts, downloadPost, purchasePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, upload.single("file"), createPost);

router.delete("/delete/:postId", verifyToken, deletePost);

router.get("/posts", getPosts);

router.get("/:postId/download", verifyToken, downloadPost);

router.post("/:postId/purchase", verifyToken, purchasePost);

export default router;