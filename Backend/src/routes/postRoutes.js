import express from "express";
import upload from "../config/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadProfilePic, createPost } from "../controllers/postController.js";

const router = express.Router();

router.post("/profile-pic", verifyToken, upload.single("profile"), uploadProfilePic);
router.post("/posts", verifyToken, upload.single("image"), createPost);

export default router;
