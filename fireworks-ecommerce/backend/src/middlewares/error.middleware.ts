import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

// ─── 404 Not Found ───────────────────────────────────────────────────────────
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

// ─── Global Error Handler ────────────────────────────────────────────────────
export const errorHandler = (
  err: AppError & { name?: string; code?: number; keyValue?: Record<string, unknown>; path?: string; value?: unknown },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose: Invalid ObjectId
  if (err.name === "CastError") {
    message = `Resource not found. Invalid ID: ${err.value as string}`;
    statusCode = 404;
  }

  // Mongoose: Duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
    statusCode = 409;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please login again.";
    statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    message = "Token expired. Please login again.";
    statusCode = 401;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values((err as unknown as { errors: Record<string, { message: string }> }).errors)
      .map((e) => e.message)
      .join(", ");
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
