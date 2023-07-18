import { body } from "express-validator";

export const loginValidation = [
  body("email", "Wrong mail format").isEmail(),
  body("password", "Password length must be more than 5 letters").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Wrong mail format").isEmail(),
  body("password", "Password length must be more than 5 letters").isLength({
    min: 5,
  }),
  body("fullName", "Name must be more than 3 letters").isLength({ min: 3 }),
  body("avatarUrl", "Wrong acces to URL").optional().isURL(),
];
