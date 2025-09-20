import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { adminController, managerController, userController } from "../controllers/userController.js";


const router = express.Router();

router.get("/admin", verifyToken, authorizeRoles("admin"), adminController);
router.get("/manager", verifyToken, authorizeRoles("manager"), managerController);
router.get("/user", verifyToken, authorizeRoles("user", "manager", "admin"), userController);

export default router;
