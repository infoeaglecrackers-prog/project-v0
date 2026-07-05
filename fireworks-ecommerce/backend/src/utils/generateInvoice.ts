import PDFDocument from "pdfkit";
import { IOrder } from "../models/Order";

const BRAND = process.env.FROM_NAME || "Eagle Crackers";
const CURRENCY = "Rs. "; // PDFKit's built-in Helvetica has no ₹ glyph — falls back to garbled text

interface InvoiceUser {
  name: string;
  email: string;
}

export const generateInvoicePDF = (order: IOrder, user: InvoiceUser): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const invoiceNo = `INV-${order._id.toString().slice(-8).toUpperCase()}`;
    const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

    // ── Header ──────────────────────────────────────────────
    doc.fontSize(22).fillColor("#c9184a").font("Helvetica-Bold").text(BRAND, 50, 50);
    doc.fontSize(9).fillColor("#666").font("Helvetica").text("Safe, certified fireworks for every festival.", 50, 76);

    doc.fontSize(16).fillColor("#111").font("Helvetica-Bold").text("TAX INVOICE", 0, 50, { align: "right" });
    doc.fontSize(9).fillColor("#666").font("Helvetica")
      .text(`Invoice No: ${invoiceNo}`, { align: "right" })
      .text(`Invoice Date: ${invoiceDate}`, { align: "right" })
      .text(`Order ID: #${order._id.toString()}`, { align: "right" });

    doc.moveTo(50, 115).lineTo(545, 115).strokeColor("#e5e5e5").stroke();

    // ── Bill To / Ship To ───────────────────────────────────
    const addr = order.shippingAddress;
    doc.fontSize(10).fillColor("#111").font("Helvetica-Bold").text("Billed & Shipped To:", 50, 130);
    doc.fontSize(9.5).fillColor("#444").font("Helvetica")
      .text(user.name, 50, 146)
      .text(user.email, 50, 160)
      .text(addr.phone, 50, 174)
      .text(addr.addressLine1 + (addr.addressLine2 ? `, ${addr.addressLine2}` : ""), 50, 188)
      .text(`${addr.city}, ${addr.state} - ${addr.pincode}`, 50, 202)
      .text(addr.country, 50, 216);

    doc.fontSize(10).fillColor("#111").font("Helvetica-Bold").text("Payment Details:", 320, 130);
    doc.fontSize(9.5).fillColor("#444").font("Helvetica")
      .text(`Method: ${order.paymentInfo.method === "cod" ? "Cash on Delivery" : "Razorpay (Online)"}`, 320, 146)
      .text(`Status: ${order.paymentInfo.status.toUpperCase()}`, 320, 160);
    if (order.paymentInfo.razorpay_payment_id) {
      doc.text(`Payment ID: ${order.paymentInfo.razorpay_payment_id}`, 320, 174);
    }

    // ── Items table ─────────────────────────────────────────
    let y = 250;
    const col = { name: 50, qty: 340, price: 400, total: 475 };

    doc.rect(50, y, 495, 22).fill("#c9184a");
    doc.fontSize(9.5).fillColor("#fff").font("Helvetica-Bold")
      .text("Item", col.name + 8, y + 6)
      .text("Qty", col.qty, y + 6, { width: 50, align: "right" })
      .text("Price", col.price, y + 6, { width: 65, align: "right" })
      .text("Total", col.total, y + 6, { width: 65, align: "right" });
    y += 22;

    doc.font("Helvetica").fillColor("#222");
    order.orderItems.forEach((item, i) => {
      const rowHeight = 22;
      if (i % 2 === 1) doc.rect(50, y, 495, rowHeight).fill("#faf5f6");
      doc.fillColor("#222").fontSize(9.5)
        .text(item.name, col.name + 8, y + 6, { width: 280, ellipsis: true })
        .text(String(item.quantity), col.qty, y + 6, { width: 50, align: "right" })
        .text(`${CURRENCY}${item.price.toFixed(2)}`, col.price, y + 6, { width: 65, align: "right" })
        .text(`${CURRENCY}${(item.price * item.quantity).toFixed(2)}`, col.total, y + 6, { width: 65, align: "right" });
      y += rowHeight;
    });

    doc.moveTo(50, y).lineTo(545, y).strokeColor("#e5e5e5").stroke();
    y += 12;

    // ── Totals ──────────────────────────────────────────────
    const totalsLine = (label: string, value: string, bold = false) => {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 11 : 9.5).fillColor(bold ? "#111" : "#444")
        .text(label, 340, y, { width: 100, align: "right" })
        .text(value, col.total, y, { width: 65, align: "right" });
      y += bold ? 20 : 16;
    };

    totalsLine("Subtotal:", `${CURRENCY}${order.itemsPrice.toFixed(2)}`);
    totalsLine("GST (18%):", `${CURRENCY}${order.taxAmount.toFixed(2)}`);
    totalsLine("Shipping:", order.shippingPrice === 0 ? "FREE" : `${CURRENCY}${order.shippingPrice.toFixed(2)}`);
    doc.moveTo(340, y).lineTo(545, y).strokeColor("#e5e5e5").stroke();
    y += 6;
    totalsLine("Grand Total:", `${CURRENCY}${order.totalAmount.toFixed(2)}`, true);

    // ── Footer ──────────────────────────────────────────────
    doc.fontSize(8.5).fillColor("#999").font("Helvetica")
      .text(
        "This is a computer-generated invoice and does not require a signature.",
        50, 730, { align: "center", width: 495 }
      )
      .text(`Thank you for shopping with ${BRAND}! Celebrate with brilliance.`, 50, 744, { align: "center", width: 495 });

    doc.end();
  });
};
