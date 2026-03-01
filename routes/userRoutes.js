import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMe, updateProfile, deleteAccount } from "../controllers/userController.js";
import { updateValidation } from "../validators/userValidator.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/update", protect, updateValidation, updateProfile);
router.delete("/delete", protect, deleteAccount);

export default router;