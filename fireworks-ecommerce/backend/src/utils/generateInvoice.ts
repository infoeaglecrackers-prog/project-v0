import PDFDocument from "pdfkit";
import { IOrder } from "../models/Order";
import { buildUpiIntent, upiQrBuffer } from "./upi";

const BRAND = process.env.FROM_NAME || "Elite Eagle Crackers";
const BRAND_EMAIL = "infoeaglecrackers@gmail.com";
const BRAND_PHONE = "+91 78678 56523";
const BRAND_ADDRESS = "Sivakasi - Kalugumalai Rd, Sivakasi, Thayilpatti, Tamil Nadu 626128";
const CURRENCY = "Rs. "; // PDFKit's built-in Helvetica has no ₹ glyph — falls back to garbled text

interface InvoiceUser {
  name: string;
  email: string;
}

// ─── Amount-in-words (Indian numbering system) ────────────────────────────
const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const twoDigitWords = (n: number): string => {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? ` ${ONES[o]}` : "");
};

const threeDigitWords = (n: number): string => {
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (!h) return twoDigitWords(r);
  const hundredWords = `${ONES[h]} Hundred`;
  return r ? `${hundredWords} ${twoDigitWords(r)}` : hundredWords;
};

/** Indian grouping: crore / lakh / thousand / hundred. */
const numberToWordsIndian = (value: number): string => {
  let num = Math.floor(value);
  if (num === 0) return "Zero";

  const crore = Math.floor(num / 1e7); num %= 1e7;
  const lakh = Math.floor(num / 1e5); num %= 1e5;
  const thousand = Math.floor(num / 1e3); num %= 1e3;
  const rest = num;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigitWords(crore)} Crore`);
  if (lakh) parts.push(`${threeDigitWords(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigitWords(thousand)} Thousand`);
  if (rest) parts.push(threeDigitWords(rest));
  return parts.join(" ");
};

const amountInWords = (amount: number): string => {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = `${numberToWordsIndian(rupees)} Rupees`;
  if (paise > 0) words += ` and ${numberToWordsIndian(paise)} Paise`;
  return `${words} Only`;
};

export const generateInvoicePDF = async (order: IOrder, user: InvoiceUser): Promise<Buffer> => {
  // Build the UPI QR up front — pdfkit's stream API is otherwise synchronous.
  let qrBuffer: Buffer | null = null;
  try {
    const intent = buildUpiIntent(order._id.toString(), order.totalAmount);
    qrBuffer = await upiQrBuffer(intent.uri);
  } catch {
    // UPI not configured on the server — invoice still renders, just without the QR box.
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = 595 - 80; // A4 width minus left+right margins
    const left = 40;

    const invoiceNo = `INV-${order._id.toString().slice(-8).toUpperCase()}`;
    const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

    // ── Title ───────────────────────────────────────────────
    doc.fontSize(20).fillColor("#111").font("Helvetica-Bold").text("INVOICE", left, 40, { align: "center", width: pageWidth });

    // ── Company details box ─────────────────────────────────
    let y = 75;
    doc.rect(left, y, pageWidth, 60).strokeColor("#ccc").lineWidth(1).stroke();
    doc.fontSize(15).fillColor("#c9184a").font("Helvetica-Bold").text(BRAND, left + 10, y + 8);
    doc.fontSize(8.5).fillColor("#555").font("Helvetica")
      .text(BRAND_ADDRESS, left + 10, y + 27)
      .text(`Phone: ${BRAND_PHONE}`, left + 10, y + 40)
      .text(`Email: ${BRAND_EMAIL}`, left + 200, y + 40);
    y += 60;

    // ── Bill To / Invoice Details ────────────────────────────
    const boxTop = y;
    const boxHeight = 78;
    const half = pageWidth / 2;

    doc.rect(left, boxTop, half, boxHeight).strokeColor("#ccc").stroke();
    doc.rect(left + half, boxTop, half, boxHeight).strokeColor("#ccc").stroke();

    doc.fontSize(9).fillColor("#111").font("Helvetica-Bold").text("Bill To:", left + 10, boxTop + 8);
    const addr = order.shippingAddress;
    doc.fontSize(9).fillColor("#333").font("Helvetica")
      .text(user.name, left + 10, boxTop + 22)
      .text(addr.addressLine1 + (addr.addressLine2 ? `, ${addr.addressLine2}` : ""), left + 10, boxTop + 35, { width: half - 20 })
      .text(`${addr.city}, ${addr.state} - ${addr.pincode}`, left + 10, boxTop + 60, { width: half - 20 });

    doc.fontSize(9).fillColor("#111").font("Helvetica-Bold").text("Invoice Details:", left + half + 10, boxTop + 8);
    doc.fontSize(9).fillColor("#333").font("Helvetica")
      .text(`Invoice No: ${invoiceNo}`, left + half + 10, boxTop + 22)
      .text(`Date: ${invoiceDate}`, left + half + 10, boxTop + 35)
      .text(`Order Ref: #${order._id.toString().slice(-8).toUpperCase()}`, left + half + 10, boxTop + 48);

    y = boxTop + boxHeight;

    // ── Items table ─────────────────────────────────────────
    const col = { idx: left, name: left + 25, qty: left + 300, price: left + 360, total: left + 430 };
    const tableWidth = pageWidth;

    doc.rect(left, y, tableWidth, 22).fill("#c9184a");
    doc.fontSize(9).fillColor("#fff").font("Helvetica-Bold")
      .text("#", col.idx + 6, y + 6, { width: 20 })
      .text("Item name", col.name, y + 6)
      .text("Quantity", col.qty, y + 6, { width: 55, align: "right" })
      .text("Price/Unit", col.price, y + 6, { width: 65, align: "right" })
      .text("Amount", col.total, y + 6, { width: 70, align: "right" });
    y += 22;

    doc.font("Helvetica").fillColor("#222");
    let totalQty = 0;
    order.orderItems.forEach((item, i) => {
      const rowHeight = 22;
      if (i % 2 === 1) doc.rect(left, y, tableWidth, rowHeight).fill("#faf5f6");
      totalQty += item.quantity;
      doc.fillColor("#222").fontSize(9)
        .text(String(i + 1), col.idx + 6, y + 6, { width: 20 })
        .text(item.name, col.name, y + 6, { width: 270, ellipsis: true })
        .text(String(item.quantity), col.qty, y + 6, { width: 55, align: "right" })
        .text(`${CURRENCY}${item.price.toFixed(2)}`, col.price, y + 6, { width: 65, align: "right" })
        .text(`${CURRENCY}${(item.price * item.quantity).toFixed(2)}`, col.total, y + 6, { width: 70, align: "right" });
      y += rowHeight;
    });

    // Column total row (quantity)
    doc.moveTo(left, y).lineTo(left + tableWidth, y).strokeColor("#ccc").stroke();
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#111")
      .text("Total", col.name, y + 6)
      .text(String(totalQty), col.qty, y + 6, { width: 55, align: "right" });
    y += 22;
    doc.moveTo(left, y).lineTo(left + tableWidth, y).strokeColor("#ccc").stroke();
    y += 12;

    // ── Totals ──────────────────────────────────────────────
    const totalsX = left + tableWidth - 220;
    const totalsLine = (label: string, value: string, bold = false) => {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 10.5 : 9.5).fillColor(bold ? "#111" : "#444")
        .text(label, totalsX, y, { width: 130, align: "right" })
        .text(value, col.total, y, { width: 70, align: "right" });
      y += bold ? 18 : 15;
    };

    totalsLine("Sub Total:", `${CURRENCY}${order.itemsPrice.toFixed(2)}`);
    if (order.discountAmount > 0) {
      totalsLine("Discount:", `- ${CURRENCY}${order.discountAmount.toFixed(2)}`);
    }
    doc.moveTo(totalsX, y).lineTo(left + tableWidth, y).strokeColor("#e5e5e5").stroke();
    y += 6;
    totalsLine("Total:", `${CURRENCY}${order.totalAmount.toFixed(2)}`, true);
    y += 6;

    doc.fontSize(8).fillColor("#999").font("Helvetica")
      .text("* Shipping charges depend on location and are to be paid at the time of collection.", totalsX - 150, y, { width: 350, align: "right" });
    y += 22;

    // ── Amount in words ─────────────────────────────────────
    doc.rect(left, y, tableWidth, 32).strokeColor("#ccc").stroke();
    doc.fontSize(8.5).fillColor("#111").font("Helvetica-Bold").text("Invoice Amount In Words:", left + 10, y + 6);
    doc.fontSize(9).fillColor("#333").font("Helvetica").text(amountInWords(order.totalAmount), left + 10, y + 18, { width: tableWidth - 20 });
    y += 32 + 16;

    // ── Scan & Pay (UPI/GPay) ─────────────────────────────────
    const bottomHeight = 100;

    doc.rect(left, y, tableWidth, bottomHeight).strokeColor("#ccc").stroke();

    doc.fontSize(8.5).fillColor("#111").font("Helvetica-Bold").text("Scan & Pay (GPay / UPI):", left + 10, y + 8);
    if (qrBuffer) {
      doc.image(qrBuffer, left + 10, y + 20, { width: 72, height: 72 });
      doc.fontSize(8).fillColor("#555").font("Helvetica").text("Scan with any UPI app to pay", left + 90, y + 44, { width: tableWidth - 100 });
    } else {
      doc.fontSize(8).fillColor("#555").font("Helvetica").text("Contact us for payment options.", left + 10, y + 30, { width: tableWidth - 20 });
    }

    y += bottomHeight + 20;

    // ── Footer ──────────────────────────────────────────────
    doc.fontSize(8.5).fillColor("#999").font("Helvetica")
      .text("This is a computer-generated invoice and does not require a signature.", left, y, { align: "center", width: tableWidth })
      .text(`Thank you for shopping with ${BRAND}! Celebrate with brilliance.`, left, y + 14, { align: "center", width: tableWidth });

    doc.end();
  });
};
