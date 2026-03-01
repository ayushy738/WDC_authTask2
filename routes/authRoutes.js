import express from "express";
import { signup, login, refresh } from "../controllers/authController.js";
import { signupValidation, loginValidation } from "../validators/authValidator.js";
import { authLimiter } from "../middleware/rateLimiter.js";


const router = express.Router();

router.post("/signup", authLimiter, signupValidation, signup);
router.post("/login", authLimiter, loginValidation, login);
router.post("/refresh", authLimiter, refresh);

export default router;