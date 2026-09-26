interface GraphResponse {
  id?: string;
  error?: { message?: string };
}

interface WhatsAppDocumentTemplateInput {
  to: string;
  templateName: string;
  languageCode?: string;
  filename: string;
  pdfBuffer: Buffer;
  bodyParameters: string[];
}

interface AdminOrderWhatsAppInput {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId: string;
  invoicePdf: Buffer;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

const GRAPH_API_VERSION = "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// The template must be created + approved in Meta WhatsApp Manager first — see backend/.env comments.
const TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || "order_invoice";
const ADMIN_TEMPLATE_NAME = process.env.WHATSAPP_ADMIN_ORDER_TEMPLATE_NAME || "admin_order_invoice";
const DEFAULT_ADMIN_ORDER_PHONE = process.env.WHATSAPP_ADMIN_ORDER_PHONE || "6382927769";

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

const sendWhatsAppDocumentTemplate = async ({
  to,
  templateName,
  languageCode = "en",
  filename,
  pdfBuffer,
  bodyParameters,
}: WhatsAppDocumentTemplateInput): Promise<void> => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) return;

  const mediaId = await uploadMedia(pdfBuffer, phoneNumberId, accessToken);

  const res = await fetch(`${GRAPH_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toE164(to),
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [
          {
            type: "header",
            parameters: [{ type: "document", document: { id: mediaId, filename } }],
          },
          {
            type: "body",
            parameters: bodyParameters.map((text) => ({ type: "text", text })),
          },
        ],
      },
    }),
  });

  const data = (await res.json()) as GraphResponse;
  if (!res.ok) throw new Error(data.error?.message || "WhatsApp message send failed");
};

export const sendWhatsAppInvoice = async (
  phone: string,
  customerName: string,
  orderId: string,
  invoicePdf: Buffer
): Promise<void> => {
  await sendWhatsAppDocumentTemplate({
    to: phone,
    templateName: TEMPLATE_NAME,
    filename: "Invoice.pdf",
    pdfBuffer: invoicePdf,
    bodyParameters: [customerName, orderId],
  });
};

const formatAddress = (address: AdminOrderWhatsAppInput["shippingAddress"]): string => {
  return [
    address.fullName,
    address.phone,
    address.addressLine1,
    address.addressLine2,
    `${address.city}, ${address.state} ${address.pincode}`,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

export const sendAdminOrderInvoice = async ({
  customerName,
  customerPhone,
  customerEmail,
  orderId,
  invoicePdf,
  totalAmount,
  shippingAddress,
}: AdminOrderWhatsAppInput): Promise<void> => {
  await sendWhatsAppDocumentTemplate({
    to: DEFAULT_ADMIN_ORDER_PHONE,
    templateName: ADMIN_TEMPLATE_NAME,
    filename: `Invoice-${orderId}.pdf`,
    pdfBuffer: invoicePdf,
    bodyParameters: [
      customerName,
      customerPhone || shippingAddress.phone || "N/A",
      customerEmail || "N/A",
      orderId,
      `Rs. ${totalAmount.toFixed(2)}`,
      formatAddress(shippingAddress),
    ],
  });
};
