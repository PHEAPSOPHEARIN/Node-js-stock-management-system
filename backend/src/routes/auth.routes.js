import express from "express";
import { authenticateToken } from "../middleware/auth.js"; // ← Add .js here!
import * as authController from "../controllers/auth.controller.js"; // ← Add .js here!

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", authenticateToken, authController.getCurrentUser);

export default router;
