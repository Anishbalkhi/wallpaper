import express from "express"
import { adminController, managerController, userController } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router =  express.Router();

router.post("/admin", verifyToken, adminController)
router.post("/manager", verifyToken, managerController)
router.post("/user", verifyToken, userController)

export default router