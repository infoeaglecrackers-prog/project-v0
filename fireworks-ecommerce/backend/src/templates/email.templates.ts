export const resetPasswordTemplate = (name: string, resetUrl: string): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Reset Password</title></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr><td style="background:#e63946;padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 Fireworks Store</h1>
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
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} Fireworks Store. All rights reserved.</p>
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
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 Fireworks Store</h1>
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
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} Fireworks Store. All rights reserved.</p>
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
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 Fireworks Store</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <h2 style="color:#333;">📦 Your Order is On the Way!</h2>
          <p style="color:#555;">Hi <strong>${name}</strong>,</p>
          <p style="color:#555;">Your order <strong>#${orderId}</strong> has been shipped.</p>
          <p style="color:#555;">Tracking Number: <strong>${trackingNumber}</strong></p>
          <p style="color:#555;">You can track your package using the tracking number above. Expected delivery in 3–5 business days. 🚚</p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} Fireworks Store. All rights reserved.</p>
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
          <h1 style="color:#fff;margin:0;font-size:28px;">🎇 Fireworks Store</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <h2 style="color:#333;">🎊 Order Delivered!</h2>
          <p style="color:#555;">Hi <strong>${name}</strong>,</p>
          <p style="color:#555;">Your order <strong>#${orderId}</strong> has been successfully delivered. We hope you enjoyed your purchase!</p>
          <p style="color:#555;">Please take a moment to share your feedback by leaving a review. Your opinion helps other customers! ⭐</p>
        </td></tr>
        <tr><td style="background:#f8f8f8;padding:20px;text-align:center;">
          <p style="color:#aaa;font-size:12px;margin:0;">© ${new Date().getFullYear()} Fireworks Store. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;
