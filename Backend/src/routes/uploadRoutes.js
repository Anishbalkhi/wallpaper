
import express from "express";
import upload from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();


router.post("/single", upload.single("file"), (req, res) => {
  res.json({
    msg: "File uploaded successfully!",
    url: req.file.path, 
  });
});


router.post("/multiple", upload.array("files", 5), (req, res) => {
  const urls = req.files.map(file => file.path);
  res.json({
    msg: "Files uploaded successfully!",
    urls,
  });
});



router.delete("/delete/:publicId", async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: "File deleted", result });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error });
  }
});


export default router;
