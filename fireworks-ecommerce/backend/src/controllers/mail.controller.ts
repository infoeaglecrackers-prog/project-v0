import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import sendEmail from "../utils/sendEmail";

// ─── Predefined email templates ───────────────────────────────────────────────
const TEMPLATES: Record<string, { subject: string; html: (name: string, extra?: Record<string, string>) => string }> = {
  offer_closing_soon: {
    subject: "⏰ Offer Closing Soon — Don't Miss Out!",
    html: (name) => `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#c9184a">🎆 Hurry! Offer Ends Soon</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Our exclusive fireworks sale is ending very soon. Get your favourite crackers before stocks run out!</p>
        <div style="background:#fff7ed;border-left:4px solid #f97316;padding:16px;border-radius:8px;margin:16px 0">
          <p style="margin:0;font-weight:bold;color:#f97316">🔥 Limited time — offer closes in hours!</p>
        </div>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/products"
          style="display:inline-block;background:#c9184a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
          Shop Now →
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">Eagle Crackers — Light Up Every Celebration 🎇</p>
      </div>`,
  },
  confirm_payment: {
    subject: "⚠️ Action Required — Please Complete Your Payment",
    html: (name, extra) => `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#c9184a">Payment Pending</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We noticed your order <strong>${extra?.orderId ? `#${extra.orderId}` : ""}</strong> is awaiting payment.</p>
        <div style="background:#fff7ed;border-left:4px solid #f97316;padding:16px;border-radius:8px;margin:16px 0">
          <p style="margin:0;font-weight:bold;color:#f97316">📦 Packing begins only after payment is confirmed.</p>
          <p style="margin:8px 0 0">Please complete your payment at the earliest to avoid order cancellation.</p>
        </div>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/orders"
          style="display:inline-block;background:#c9184a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
          Pay Now →
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">Eagle Crackers — Light Up Every Celebration 🎇</p>
      </div>`,
  },
  thank_you_order: {
    subject: "🙏 Thank You for Your Order!",
    html: (name) => `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#c9184a">Thank You for Ordering!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We sincerely thank you for choosing Eagle Crackers. Your order is being processed with care.</p>
        <p>We hope our fireworks light up your celebrations! 🎆🎇✨</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/orders"
          style="display:inline-block;background:#c9184a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
          View My Orders →
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">Eagle Crackers — Light Up Every Celebration 🎇</p>
      </div>`,
  },
  information_required: {
    subject: "📋 Information Required for Your Order",
    html: (name, extra) => `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#c9184a">We Need a Little More Information</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We require some additional information to process your order${extra?.orderId ? ` <strong>#${extra.orderId}</strong>` : ""}.</p>
        <div style="background:#f0f9ff;border-left:4px solid #0ea5e9;padding:16px;border-radius:8px;margin:16px 0">
          <p style="margin:0;color:#0369a1">${extra?.customMessage || "Please reply to this email or contact our support team with the required details."}</p>
        </div>
        <p>Our support team is ready to help you. You can reach us at <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a>.</p>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">Eagle Crackers — Light Up Every Celebration 🎇</p>
      </div>`,
  },
  new_arrival: {
    subject: "🎆 New Arrivals Are Here — Check Them Out!",
    html: (name) => `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#c9184a">🎆 Fresh Fireworks Just Landed!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We've added exciting new fireworks and crackers to our collection. Be the first to grab the latest!</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/products"
          style="display:inline-block;background:#c9184a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
          Explore New Arrivals →
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">Eagle Crackers — Light Up Every Celebration 🎇</p>
      </div>`,
  },
  seasonal_greetings: {
    subject: "🎉 Season's Greetings from Eagle Crackers!",
    html: (name) => `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#c9184a">🎉 Warm Wishes from Eagle Crackers!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Wishing you and your family a joyful and bright festive season! May your celebrations be filled with light and laughter.</p>
        <p>Visit us for the best crackers to make your festival extra special! 🎆🪔✨</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}"
          style="display:inline-block;background:#c9184a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
          Visit Eagle Crackers →
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">Eagle Crackers — Light Up Every Celebration 🎇</p>
      </div>`,
  },
  custom: {
    subject: "",
    html: (_name, extra) => extra?.html || "",
  },
};

export const getEmailTemplates = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const templates = Object.entries(TEMPLATES)
      .filter(([key]) => key !== "custom")
      .map(([key, val]) => ({ id: key, subject: val.subject }));
    res.status(200).json({ success: true, data: { templates } });
  }
);

// ─── Admin: Send bulk / targeted email ───────────────────────────────────────
export const sendBulkEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      templateId,
      recipientType,   // "all" | "selected"
      userIds,         // used when recipientType === "selected"
      customSubject,
      customHtml,
      extraData,       // { orderId?, customMessage? }
    } = req.body as {
      templateId: string;
      recipientType: "all" | "selected";
      userIds?: string[];
      customSubject?: string;
      customHtml?: string;
      extraData?: Record<string, string>;
    };

    const template = TEMPLATES[templateId];
    if (!template) return next(new AppError("Invalid template ID.", 400));

    // Resolve recipients
    let users: { name: string; email: string }[] = [];
    if (recipientType === "all") {
      users = await User.find({ role: "user" }).select("name email").lean();
    } else {
      if (!userIds || userIds.length === 0)
        return next(new AppError("Please select at least one user.", 400));
      users = await User.find({ _id: { $in: userIds } }).select("name email").lean();
    }

    if (users.length === 0)
      return next(new AppError("No users found for the selected criteria.", 404));

    const subject = templateId === "custom" ? (customSubject || "Message from Eagle Crackers") : template.subject;
    let successCount = 0;
    const errors: string[] = [];

    // Send emails sequentially to avoid SMTP rate limits
    for (const user of users) {
      try {
        const html =
          templateId === "custom"
            ? (customHtml || "")
            : template.html(user.name, extraData);
        await sendEmail({ to: user.email, subject, html });
        successCount++;
      } catch (err) {
        errors.push(user.email);
        console.error(`Failed to send email to ${user.email}:`, err);
      }
    }

    res.status(200).json({
      success: true,
      message: `Email sent to ${successCount} of ${users.length} users.${errors.length ? ` Failed: ${errors.join(", ")}` : ""}`,
      data: { sent: successCount, failed: errors.length, total: users.length },
    });
  }
);
