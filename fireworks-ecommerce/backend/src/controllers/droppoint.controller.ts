import { Request, Response, NextFunction } from "express";
import DropPoint from "../models/DropPoint";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { invalidateDropPointCache } from "../utils/cache";

// ─── Public: Get all active drop points ──────────────────────────────────────
export const getDropPoints = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { pincode, city } = req.query as { pincode?: string; city?: string };

    const filter: Record<string, unknown> = { isActive: true };

    // If pincode/city provided, return matching ones + all others (client ranks them)
    // We still return everything so the UI can show "other locations" too
    const dropPoints = await DropPoint.find(filter).sort("city name").lean();
    
    console.log("Drop points query - Filter:", filter, "Total returned:", dropPoints.length);

    if (pincode || city) {
      const pin = (pincode || "").trim();
      const cty = (city || "").toLowerCase().trim();

      const nearby: typeof dropPoints = [];
      const sameCity: typeof dropPoints = [];
      const others: typeof dropPoints = [];

      for (const dp of dropPoints) {
        if (pin && dp.pincode === pin) nearby.push(dp);
        else if (cty && dp.city.toLowerCase() === cty) sameCity.push(dp);
        else others.push(dp);
      }

      console.log("Categorized results - Nearby:", nearby.length, "Same city:", sameCity.length, "Others:", others.length);

      return res.status(200).json({
        success: true,
        data: { dropPoints, nearby, sameCity, others },
      });
    }

    console.log("Returning all drop points without filters:", dropPoints.length);
    res.status(200).json({ success: true, data: { dropPoints, nearby: [], sameCity: [], others: dropPoints } });
  }
);

// ─── Admin: Get all drop points (including inactive) ─────────────────────────
export const adminGetAllDropPoints = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const dropPoints = await DropPoint.find().sort("city name");
    res.status(200).json({ success: true, data: { dropPoints } });
  }
);

// ─── Admin: Create drop point ─────────────────────────────────────────────────
export const createDropPoint = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const dropPoint = await DropPoint.create(req.body);
    await invalidateDropPointCache();
    res.status(201).json({ success: true, data: { dropPoint } });
  }
);

// ─── Admin: Update drop point ─────────────────────────────────────────────────
export const updateDropPoint = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const dropPoint = await DropPoint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dropPoint) return next(new AppError("Drop point not found.", 404));
    await invalidateDropPointCache();
    res.status(200).json({ success: true, data: { dropPoint } });
  }
);

// ─── Admin: Delete drop point ─────────────────────────────────────────────────
export const deleteDropPoint = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const dropPoint = await DropPoint.findByIdAndDelete(req.params.id);
    if (!dropPoint) return next(new AppError("Drop point not found.", 404));
    await invalidateDropPointCache();
    res.status(200).json({ success: true, message: "Drop point deleted." });
  }
);
