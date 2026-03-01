import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import * as authService from "../services/authService.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { setAuthCookies } from "../utils/setAuthCookies.js";

export const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { accessToken, refreshToken } =
            await authService.loginUser(req.body);
        setAuthCookies(res, accessToken, refreshToken);
        return res.status(200).json({
            message: "Login successful"
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

export const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const newAccessToken = generateAccessToken(decoded.id);
        setAuthCookies(res, newAccessToken);
        return res.json({ message: "Access token refreshed" });
    } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
    }
};