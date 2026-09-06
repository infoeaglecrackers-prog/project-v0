const BRAND = process.env.FROM_NAME || "Elite Eagle Crackers";

export const resetPasswordTemplate = (name: string, resetUrl: string): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Reset Password</title></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr><td style="background:#e63946;padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 ${BRAND}</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <h2 style="color:#333;">Hi ${name},</h2>
          <p style="color:#555;line-height:1.6;">We received a request to reset the password for your account.</p>
          <p style="color:#555;line-height:1.6;">Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${resetUrl}" style="background:#e63946;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold;">Reset Password</a>
          </div>
          <p style="color:#888;font-size:14px;">If you didn't request a password reset, please ignore this email.</p>
          <p style="color:#888;font-size:12px;word-break:break-all;">Or copy this link: ${resetUrl}</p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

export const otpVerificationTemplate = (name: string, otp: string): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Verify Your Email</title></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr><td style="background:#e63946;padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 ${BRAND}</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <h2 style="color:#333;">Hi ${name},</h2>
          <p style="color:#555;line-height:1.6;">Use the code below to verify your email address. This code expires in <strong>10 minutes</strong>.</p>
          <div style="text-align:center;margin:30px 0;">
            <span style="display:inline-block;background:#f8f8f8;border:2px dashed #e63946;color:#e63946;padding:16px 32px;border-radius:8px;font-size:32px;font-weight:bold;letter-spacing:8px;">${otp}</span>
          </div>
          <p style="color:#888;font-size:14px;">If you didn't request this, please ignore this email.</p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

export const orderConfirmationTemplate = (
  name: string,
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Order Confirmed</title></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr><td style="background:#e63946;padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 ${BRAND}</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <h2 style="color:#333;">🎉 Order Confirmed!</h2>
          <p style="color:#555;">Hi <strong>${name}</strong>, thank you for your order!</p>
          <p style="color:#555;">Order ID: <strong>#${orderId}</strong></p>
          <table width="100%" style="border-collapse:collapse;margin:20px 0;">
            <tr style="background:#f8f8f8;">
              <th style="padding:10px;text-align:left;border-bottom:1px solid #eee;">Product</th>
              <th style="padding:10px;text-align:center;border-bottom:1px solid #eee;">Qty</th>
              <th style="padding:10px;text-align:right;border-bottom:1px solid #eee;">Price</th>
            </tr>
            ${items
              .map(
                (item) => `
            <tr>
              <td style="padding:10px;border-bottom:1px solid #eee;">${item.name}</td>
              <td style="padding:10px;text-align:center;border-bottom:1px solid #eee;">${item.quantity}</td>
              <td style="padding:10px;text-align:right;border-bottom:1px solid #eee;">₹${item.price.toFixed(2)}</td>
            </tr>`
              )
              .join("")}
            <tr>
              <td colspan="2" style="padding:10px;text-align:right;font-weight:bold;">Total:</td>
              <td style="padding:10px;text-align:right;font-weight:bold;color:#e63946;">₹${total.toFixed(2)}</td>
            </tr>
          </table>
          <p style="color:#555;">We'll notify you once your order is shipped. 🚀</p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

export const orderShippedTemplate = (
  name: string,
  orderId: string,
  trackingNumber: string
): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Order Shipped</title></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr><td style="background:#e63946;padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 ${BRAND}</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <h2 style="color:#333;">📦 Your Order is On the Way!</h2>
          <p style="color:#555;">Hi <strong>${name}</strong>,</p>
          <p style="color:#555;">Your order <strong>#${orderId}</strong> has been shipped.</p>
          <p style="color:#555;">Tracking Number: <strong>${trackingNumber}</strong></p>
          <p style="color:#555;">You can track your package using the tracking number above. Expected delivery in 3–5 business days. 🚚</p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

/**
 * The "please pay" email for an order sitting in AwaitingPayment.
 *
 * Two deliberate choices:
 *
 * 1. No order ID anywhere. It's a Mongo ObjectId fragment — meaningless to a
 *    shopper and it made a warm email read like a system notice. Support can
 *    still find the order from the customer's email address or the UTR.
 *
 * 2. The button href is https, NOT the raw `upi://` intent. Gmail, Outlook and
 *    most webmail clients strip or rewrite non-http(s) schemes, so a `upi://`
 *    button would silently do nothing for most people. Instead it points at the
 *    order page with ?pay=1, which hands off to the UPI app on arrival.
 *
 * `qrCid` is the Content-ID of a PNG attached alongside this HTML — data: URLs
 * get stripped by both Gmail and Outlook.
 */
export const paymentRequestTemplate = (
  name: string,
  payUrl: string,
  amount: number,
  dueDate: string,
  upiVpa: string,
  qrCid?: string
): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Complete your payment</title></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr><td style="background:#e63946;padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 ${BRAND}</h1>
        </td></tr>

        <tr><td style="padding:40px 30px 24px;">
          <h2 style="color:#333;margin:0 0 16px;">Thank you, ${name}! 🎆</h2>
          <p style="color:#555;line-height:1.6;margin:0 0 14px;">
            Your crackers are picked out and set aside for you — just the payment left to go.
          </p>

          <div style="background:#fff7ed;border-left:4px solid #f97316;padding:18px 20px;border-radius:8px;margin:22px 0;">
            <p style="margin:0;color:#9a3412;font-size:14px;">Amount to pay</p>
            <p style="margin:4px 0 0;color:#c2410c;font-size:26px;font-weight:bold;">Rs. ${amount.toFixed(2)}</p>
            <p style="margin:10px 0 0;color:#9a3412;font-size:13px;">Please complete it by <strong>${dueDate}</strong>.</p>
          </div>

          <div style="text-align:center;margin:28px 0 8px;">
            <a href="${payUrl}"
              style="display:inline-block;background:#c9184a;color:#fff;padding:15px 34px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
              Pay with Google Pay →
            </a>
            <p style="color:#9ca3af;font-size:12px;margin:10px 0 0;">Opens your UPI app on a phone</p>
          </div>
        </td></tr>

        ${qrCid ? `
        <tr><td style="padding:0 30px 10px;text-align:center;">
          <p style="color:#6b7280;font-size:13px;margin:0 0 12px;">— or scan with any UPI app —</p>
          <img src="cid:${qrCid}" alt="UPI QR code to pay Rs. ${amount.toFixed(2)}"
            width="180" height="180"
            style="border:1px solid #e5e7eb;border-radius:12px;padding:8px;background:#fff;" />
        </td></tr>` : ""}

        <tr><td style="padding:14px 30px 30px;">
          <p style="color:#6b7280;font-size:13px;margin:0 0 6px;text-align:center;">
            Paying manually? Send to <strong style="color:#374151;">${upiVpa}</strong>
          </p>

          <div style="background:#f9fafb;border-radius:8px;padding:16px 18px;margin-top:20px;">
            <p style="margin:0;color:#4b5563;font-size:13px;line-height:1.6;">
              <strong>One last step:</strong> after paying, open your order page and enter the
              12-digit reference number (your UPI app calls it the UTR or transaction ID).
              We'll confirm it against our bank statement and start packing straight away.
            </p>
          </div>

          <p style="color:#9ca3af;font-size:12px;margin:20px 0 0;line-height:1.5;">
            If we don't receive payment by ${dueDate}, we'll release these items back to stock
            so someone else can enjoy them. Questions? Just reply to this email — we're happy to help.
          </p>
        </td></tr>

        <tr><td style="background:#f8f8f8;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

export const orderDeliveredTemplate = (name: string, orderId: string): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Order Delivered</title></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr><td style="background:#e63946;padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 ${BRAND}</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <h2 style="color:#333;">🎊 Order Delivered!</h2>
          <p style="color:#555;">Hi <strong>${name}</strong>,</p>
          <p style="color:#555;">Your order <strong>#${orderId}</strong> has been successfully delivered. We hope you enjoyed your purchase!</p>
          <p style="color:#555;">Please take a moment to share your feedback by leaving a review. Your opinion helps other customers! ⭐</p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;
