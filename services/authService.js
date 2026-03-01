import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";
import { 
    generateAccessToken, 
    generateRefreshToken 
} from "../utils/generateToken.js";

export const registerUser = async ({ name, email, password }) => {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(name, email, hashedPassword);
    return { id: userId, email };
};

export const loginUser = async ({ email, password }) => {
    const user = await userModel.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { accessToken, refreshToken };
};