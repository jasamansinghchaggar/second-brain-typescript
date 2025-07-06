import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    _id: Types.ObjectId | string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({ message: "Authorization denied." });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
