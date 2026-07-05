interface GraphResponse {
  id?: string;
  error?: { message?: string };
}

const GRAPH_API_VERSION = "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// The template must be created + approved in Meta WhatsApp Manager first — see backend/.env comments.
const TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || "order_invoice";

// India-only: stored phone numbers are plain 10-digit mobiles (see User.ts phone regex).
const toE164 = (phone: string) => (phone.startsWith("91") ? phone : `91${phone}`);

// Uploads the PDF to WhatsApp's media endpoint, returning a media ID for the template send.
const uploadMedia = async (pdfBuffer: Buffer, phoneNumberId: string, accessToken: string): Promise<string> => {
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", "application/pdf");
  form.append("file", new Blob([pdfBuffer], { type: "application/pdf" }), "Invoice.pdf");

  const res = await fetch(`${GRAPH_BASE}/${phoneNumberId}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });
  const data = (await res.json()) as GraphResponse;
  if (!res.ok || !data.id) throw new Error(data.error?.message || "WhatsApp media upload failed");
  return data.id;
};

export const sendWhatsAppInvoice = async (
  phone: string,
  customerName: string,
  orderId: string,
  invoicePdf: Buffer
): Promise<void> => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) return; // Not configured — silently skip

  const mediaId = await uploadMedia(invoicePdf, phoneNumberId, accessToken);

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
        name: TEMPLATE_NAME,
        language: { code: "en" },
        components: [
          {
            type: "header",
            parameters: [{ type: "document", document: { id: mediaId, filename: "Invoice.pdf" } }],
          },
          {
            type: "body",
            parameters: [
              { type: "text", text: customerName },
              { type: "text", text: orderId },
            ],
          },
        ],
      },
    }),
  });

  const data = (await res.json()) as GraphResponse;
  if (!res.ok) throw new Error(data.error?.message || "WhatsApp message send failed");
};
