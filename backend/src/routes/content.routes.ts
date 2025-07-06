import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import Content from "../models/content.model";
import Tag from "../models/tags.model";

const contentRoutes = Router();

contentRoutes.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user._id) {
        res.status(401).json({ message: "Unauthorized: user not found" });
      }
      const contents = await Content.find({ userId: req.user?._id });
      res.status(200).json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content", error });
    }
  }
);

contentRoutes.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user._id) {
        res.status(401).json({ message: "Unauthorized: user not found" });
        return;
      }
      const { link, type, title, tags } = req.body;
      let tagIds: any[] = [];
      if (Array.isArray(tags) && tags.length > 0) {
        tagIds = await Promise.all(
          tags.map(async (tagTitle: string) => {
            let tag = await Tag.findOne({ title: tagTitle });
            if (!tag) {
              tag = await Tag.create({ title: tagTitle });
            }
            return tag._id;
          })
        );
      }
      const content = new Content({
        link,
        type,
        title,
        tags: tagIds,
        userId: req.user?._id,
      });
      await content.save();
      res.status(200).json({ message: "Content created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create content", error });
    }
  }
);

contentRoutes.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || !req.user._id) {
        res.status(401).json({ message: "Unauthorized: user not found" });
        return;
      }
      const contentId = req.params.id;
      const userId = req.user?._id;
      const deleted = await Content.findOneAndDelete({
        _id: contentId,
        userId,
      });
      if (!deleted) {
        const exists = await Content.findById(contentId);
        if (exists) {
          res
            .status(403)
            .json({
              message: "You are not authorized to delete this content",
            });
        } else {
          res.status(404).json({ message: "Content not found" });
        }
        return;
      }
      res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content", error });
    }
  }
);

export default contentRoutes;
