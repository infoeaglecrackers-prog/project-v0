import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const adminOnly = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only.", 403));
  }
  next();
};
