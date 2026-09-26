interface GraphResponse {
  error?: { message?: string };
}

const GRAPH_API_VERSION = "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// Must be an approved "Authentication" category template in Meta WhatsApp Manager
// (see backend/.env comments) — free-form OTP text isn't allowed outside the 24h window.
const OTP_TEMPLATE_NAME = process.env.WHATSAPP_OTP_TEMPLATE_NAME || "otp_verification";
const OTP_TEMPLATE_LANG = process.env.WHATSAPP_OTP_TEMPLATE_LANG || "en";

// India-only: stored phone numbers are plain 10-digit mobiles (see User.ts phone regex).
const toE164 = (phone: string) => (phone.startsWith("91") ? phone : `91${phone}`);

export const sendWhatsAppOtp = async (phone: string, otp: string): Promise<void> => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) {
    throw new Error(
      "WhatsApp Cloud API is not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN."
    );
  }

  const res = await fetch(`${GRAPH_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toE164(phone),
      type: "template",
      template: {
        name: OTP_TEMPLATE_NAME,
        language: { code: OTP_TEMPLATE_LANG },
        components: [
          { type: "body", parameters: [{ type: "text", text: otp }] },
          // Standard Meta "copy code" authentication template button.
          { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: otp }] },
        ],
      },
    }),
  });

  const data = (await res.json()) as GraphResponse;
  if (!res.ok) throw new Error(data.error?.message || "WhatsApp OTP send failed");
};
