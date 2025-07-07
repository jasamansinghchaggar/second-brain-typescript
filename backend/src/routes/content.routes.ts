import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createContent,
  deleteContent,
  getContent,
} from "../controllers/content.controller";

const contentRoutes = Router();

contentRoutes.get("/", authMiddleware, getContent);

contentRoutes.post("/", authMiddleware, createContent);

contentRoutes.delete("/:id", authMiddleware, deleteContent);

export default contentRoutes;
