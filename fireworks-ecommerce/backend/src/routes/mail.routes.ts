import { Router } from "express";
import { body } from "express-validator";
import { sendBulkEmail, getEmailTemplates } from "../controllers/mail.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(protect, adminOnly);

router.get("/templates", getEmailTemplates);

router.post(
  "/send",
  [
    body("templateId").notEmpty().withMessage("Template ID is required"),
    body("recipientType")
      .isIn(["all", "selected"])
      .withMessage("recipientType must be 'all' or 'selected'"),
    body("userIds").optional().isArray(),
    body("customSubject").optional().trim(),
    body("customHtml").optional().trim(),
  ],
  validate,
  sendBulkEmail
);

export default router;
