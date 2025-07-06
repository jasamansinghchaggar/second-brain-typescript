import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookieOptions";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";

const authRoutes = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

authRoutes.get(
  "/profile",
  authMiddleware,
  (req: AuthRequest, res: Response): void => {
    res
      .status(200)
      .json({ message: "Welcome to the authentication API", user: req.user });
  }
);

authRoutes.post(
  "/signup",
  async (req: Request, res: Response): Promise<any> => {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    const { email, password, username } = parseResult.data;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, username });
      await user.save();
      res.status(200).json({ message: "User created successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }
);

authRoutes.post(
  "/signin",
  async (req: Request, res: Response): Promise<any> => {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    const { email, password } = parseResult.data;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password as string
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("accessToken", token, cookieOptions as Object);
      res.status(200).json({ message: "Login successful", userId: user._id });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }
);

authRoutes.get("/logout", (req: Request, res: Response): void => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default authRoutes;
