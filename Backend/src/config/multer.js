
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", 
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4"], 
    transformation: [{ quality: "auto" }]
  },
});

const upload = multer({ storage });

export default upload;
