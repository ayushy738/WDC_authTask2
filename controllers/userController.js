import { validationResult } from "express-validator";
import * as userService from "../services/userService.js";

export const getMe = async (req, res) => {
    const user = await userService.getUserProfile(req.user);
    res.json(user);
};

export const updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    await userService.updateProfile(req.user, req.body);
    res.json({ message: "Profile updated successfully" });
};

export const deleteAccount = async (req, res) => {
    try {
        await userService.deleteUser(req.user);
        res.clearCookie("token");
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};