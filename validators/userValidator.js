import { body } from "express-validator";

export const updateValidation = [
    body("name").optional().notEmpty(),
    body("bio").optional().isLength({ max: 200 }),
    body("contact").optional().isLength({ min: 10, max: 15 }),
];