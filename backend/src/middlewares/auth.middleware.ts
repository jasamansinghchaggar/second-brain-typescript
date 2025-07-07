import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { verifyJwt } from "../utils/jwt";
import { ErrorHandler } from "../utils/errorHandler";

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
    return ErrorHandler.unauthorized(res, null, "Authorization denied.");
  }
  try {
    const decoded = verifyJwt(token);
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    ErrorHandler.unauthorized(res, err, "Invalid or expired token.");
  }
};
