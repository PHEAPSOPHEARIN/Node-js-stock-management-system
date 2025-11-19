import express from "express";
import { authenticateToken } from "../middleware/auth";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", authenticateToken, authController.getCurrentUser);

export default router;
