import QRCode from "qrcode";
import { getUpiConfig } from "../config/features";
import AppError from "./AppError";

/**
 * Builds the `upi://pay` intent for an order and renders it as a QR.
 *
 * On mobile the URI hands off directly to GPay/PhonePe/any UPI app; on desktop
 * the customer scans the QR with their phone. Both carry the same payee VPA,
 * amount and order reference.
 *
 * Caveat worth remembering when reading `am=`: for a plain (non-PSP-signed) VPA
 * link, several UPI apps let the payer edit the amount before confirming. The
 * amount below is therefore a *request*, not a guarantee — admin verification
 * must check the amount actually credited, not just that a UTR exists.
 */

/** Short, human-quotable order reference. Also what the payer sees in their app. */
export const orderRef = (orderId: string): string =>
  `EC${orderId.slice(-8).toUpperCase()}`;

export interface UpiIntent {
  /** The `upi://pay?...` deep link. */
  uri: string;
  vpa: string;
  payeeName: string;
  /** Rupees, fixed to 2 decimals — UPI rejects more precision. */
  amount: string;
  refId: string;
  note: string;
}

export const buildUpiIntent = (orderId: string, totalAmount: number): UpiIntent => {
  const { vpa, payeeName } = getUpiConfig();

  if (!vpa) {
    throw new AppError(
      "UPI collection is not configured on the server. Set UPI_VPA in the environment.",
      500
    );
  }

  const refId = orderRef(orderId);
  const amount = totalAmount.toFixed(2);
  const note = `Order ${refId}`;

  // Hand-encoded rather than via URLSearchParams: that encodes spaces as "+",
  // which some UPI apps render literally in the payee name / note fields.
  const query = [
    `pa=${encodeURIComponent(vpa)}`,
    `pn=${encodeURIComponent(payeeName)}`,
    `am=${encodeURIComponent(amount)}`,
    `cu=INR`,
    `tn=${encodeURIComponent(note)}`,
    `tr=${encodeURIComponent(refId)}`,
  ].join("&");

  return { uri: `upi://pay?${query}`, vpa, payeeName, amount, refId, note };
};

/** Renders the intent URI as a PNG data URL for inline <img> use. */
export const upiQrDataUrl = (uri: string): Promise<string> =>
  QRCode.toDataURL(uri, { errorCorrectionLevel: "M", margin: 1, width: 320 });

/**
 * Same QR as a raw PNG buffer, for embedding in email as a CID attachment.
 * Data URLs can't be used here — Gmail and Outlook both strip `src="data:..."`,
 * so the image has to travel as a real attachment referenced by Content-ID.
 */
export const upiQrBuffer = (uri: string): Promise<Buffer> =>
  QRCode.toBuffer(uri, { errorCorrectionLevel: "M", margin: 1, width: 320 });

/** A UTR (a.k.a. bank reference number) is always 12 digits. */
export const UTR_PATTERN = /^\d{12}$/;
