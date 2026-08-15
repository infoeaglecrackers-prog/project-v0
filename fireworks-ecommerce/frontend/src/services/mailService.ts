import api from "./api";

export const mailService = {
  getTemplates: () => api.get("/admin/mail/templates"),
  sendBulkEmail: (data: {
    templateId: string;
    recipientType: "all" | "selected";
    userIds?: string[];
    customSubject?: string;
    customHtml?: string;
    extraData?: Record<string, string>;
  }) => api.post("/admin/mail/send", data),
};
