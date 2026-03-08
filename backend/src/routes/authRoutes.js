import express from 'express';
import {
  forgotPasswordHandler,
  login,
  me,
  resetPasswordHandler,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/login', login);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);
router.get("/me", authMiddleware, me);

export default router;
