import { Request, Response } from "express";
import { signJwt } from "../utils/jwt";
import { ErrorHandler } from "../utils/errorHandler";
import { cookieOptions } from "../utils/cookieOptions";
import { AuthRequest } from "../middlewares/auth.middleware";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { createUser, getUserByEmail } from "../services/user.service";
import { loginSchema, signupSchema } from "../validators/auth.validator";

export const getProfile = (req: AuthRequest, res: Response): void => {
  res
    .status(200)
    .json({ message: "Welcome to the authentication API", user: req.user });
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return ErrorHandler.badRequest(
      res,
      parseResult.error.errors,
      "Validation failed"
    );
  }
  const { email, password, username } = parseResult.data;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return ErrorHandler.conflict(res, null, "User already exists");
    }
    const hashedPassword = hashPassword(password);
    const user = (await createUser(email, hashedPassword, username)).save();
    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    ErrorHandler.internal(res, err);
  }
};

export const signin = async (req: Request, res: Response): Promise<any> => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return ErrorHandler.badRequest(
      res,
      parseResult.error.errors,
      "Validation failed"
    );
  }
  const { email, password } = parseResult.data;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return ErrorHandler.notFound(res, null, "User not found");
    }
    const isPasswordValid = comparePassword(password, user.password as string);
    if (!isPasswordValid) {
      return ErrorHandler.unauthorized(res, null, "Invalid credentials");
    }
    const token = signJwt({ userId: user._id });

    res.cookie("accessToken", token, cookieOptions as Object);
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (err) {
    ErrorHandler.internal(res, err);
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    ErrorHandler.internal(res, err);
  }
};
