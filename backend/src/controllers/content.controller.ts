import { Response } from "express";
import { ErrorHandler } from "../utils/errorHandler";
import { IContent } from "../models/content.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createNewContent,
  createTag,
  deleteContentById,
  getAllContentByUserId,
  getContentById,
  getTagByTitle,
} from "../services/content.services";

export const getContent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorHandler.unauthorized(
        res,
        null,
        "Unauthorized: user not found"
      );
    }
    const contents = await getAllContentByUserId(req.user?._id as string);
    res.status(200).json(contents);
  } catch (error) {
    ErrorHandler.internal(res, error, "Failed to fetch content");
  }
};

export const createContent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorHandler.unauthorized(
        res,
        null,
        "Unauthorized: user not found"
      );
    }
    const { link, type, title, tags } = req.body;
    let tagIds: any[] = [];
    if (Array.isArray(tags) && tags.length > 0) {
      tagIds = await Promise.all(
        tags.map(async (tagTitle: string) => {
          let tag = await getTagByTitle(tagTitle);
          if (!tag) {
            tag = await createTag(tagTitle);
          }
          return tag._id;
        })
      );
    }
    const contentToCreate = {
      link,
      type,
      title,
      tags: tagIds,
      userId: req.user?._id,
    };

    const content = await createNewContent(contentToCreate as IContent);
    await content.save();
    res.status(200).json({ message: "Content created successfully" });
  } catch (error) {
    ErrorHandler.internal(res, error, "Failed to create content");
  }
};

export const deleteContent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      return ErrorHandler.unauthorized(
        res,
        null,
        "Unauthorized: user not found"
      );
    }
    const contentId = req.params.id;
    const userId = req.user?._id;
    const deleted = await deleteContentById(contentId, userId as string);
    if (!deleted) {
      const exists = await getContentById(contentId);
      if (exists) {
        return ErrorHandler.custom(
          res,
          null,
          403,
          "You are not authorized to delete this content"
        );
      } else {
        return ErrorHandler.notFound(res, null, "Content not found");
      }
    }
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    ErrorHandler.internal(res, error, "Failed to delete content");
  }
};
