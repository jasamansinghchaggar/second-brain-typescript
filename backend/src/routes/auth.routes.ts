import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  logout,
  signin,
  signup,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.get("/profile", authMiddleware, getProfile);

authRoutes.post("/signup", signup);

authRoutes.post("/signin", signin);

authRoutes.get("/logout", logout);

export default authRoutes;
