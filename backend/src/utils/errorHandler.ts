import { Response } from "express";

export class ErrorHandler {
  static badRequest(res: Response, error: any, message = "Bad Request") {
    res.status(400).json({ message, error });
  }

  static unauthorized(res: Response, error: any, message = "Unauthorized") {
    res.status(401).json({ message, error });
  }

  static notFound(res: Response, error: any, message = "Not Found") {
    res.status(404).json({ message, error });
  }

  static conflict(res: Response, error: any, message = "Conflict") {
    res.status(409).json({ message, error });
  }

  static internal(res: Response, error: any, message = "Server Error") {
    res.status(500).json({ message, error });
  }

  static custom(res: Response, error: any, statusCode = 500, message = "Error") {
    res.status(statusCode).json({ message, error });
  }
}
