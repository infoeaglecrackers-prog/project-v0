import { useEffect, useState, useRef } from "react";
import { Send, Users, User, ChevronDown, Loader2, Mail, SquarePen, Check, X } from "lucide-react";
import { mailService } from "../../services/mailService";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";

interface Template { id: string; subject: string; }
interface UserOption { _id: string; name: string; email: string; }

const EXTRA_FIELDS: Record<string, { key: string; label: string; placeholder: string }[]> = {
  confirm_payment: [{ key: "orderId", label: "Order ID (last 8 chars)", placeholder: "e.g. AB12CD34" }],
  information_required: [
    { key: "orderId", label: "Order ID (optional)", placeholder: "Order ID" },
    { key: "customMessage", label: "Specific info needed", placeholder: "Please share your ID proof..." },
  ],
};

export default function AdminMailPanel() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [recipientType, setRecipientType] = useState<"all" | "selected">("all");
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [showUserDrop, setShowUserDrop] = useState(false);
  const [extraData, setExtraData] = useState<Record<string, string>>({});
  const [customSubject, setCustomSubject] = useState("");
  const [customHtml, setCustomHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mailService.getTemplates().then((r) => {
      const tpls: Template[] = r.data.data?.templates || [];
      tpls.push({ id: "custom", subject: "✏️ Custom Message" });
      setTemplates(tpls);
    }).catch(() => toast.error("Failed to load templates"));

    adminService.getUsers({ limit: 500 }).then((r) => {
      setAllUsers(r.data.data?.users || []);
    }).catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowUserDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredUsers = allUsers.filter(
    (u) =>
      !selectedUsers.find((s) => s._id === u._id) &&
      (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const addUser = (u: UserOption) => { setSelectedUsers((p) => [...p, u]); setUserSearch(""); };
  const removeUser = (id: string) => setSelectedUsers((p) => p.filter((u) => u._id !== id));

  const handleSend = async () => {
    if (!selectedTemplate) { toast.error("Please select a template"); return; }
    if (recipientType === "selected" && selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    if (selectedTemplate === "custom" && !customSubject.trim()) {
      toast.error("Please enter a subject for your custom email");
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const { data } = await mailService.sendBulkEmail({
        templateId: selectedTemplate,
        recipientType,
        userIds: recipientType === "selected" ? selectedUsers.map((u) => u._id) : undefined,
        customSubject: selectedTemplate === "custom" ? customSubject : undefined,
        customHtml: selectedTemplate === "custom" ? customHtml : undefined,
        extraData: Object.keys(extraData).length ? extraData : undefined,
      });
      setResult(data.data);
      toast.success(data.message);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  const inp = "w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary";
  const selectedTpl = templates.find((t) => t.id === selectedTemplate);

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-dark dark:text-gray-100 flex items-center gap-2"><Mail size={20} /> Mail Panel</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Send emails to customers using predefined or custom templates</p>
      </div>

      <div className="space-y-6">
        {/* ── Template Selection ─────────────────────────────────── */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-dark dark:text-gray-100 mb-3 flex items-center gap-2"><SquarePen size={15} /> Choose Template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelectedTemplate(t.id); setExtraData({}); }}
                className={`text-left px-3 py-2.5 rounded-xl border-2 text-sm transition-colors ${
                  selectedTemplate === t.id
                    ? "border-primary bg-primary/5 dark:bg-primary/10 font-medium text-dark dark:text-gray-100"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                <span>{t.id === "custom" ? "✏️" : "📧"} {t.subject.replace(/^[^\s]+ /, "")}</span>
              </button>
            ))}
          </div>

          {/* Extra fields per template */}
          {selectedTemplate && EXTRA_FIELDS[selectedTemplate] && (
            <div className="mt-4 space-y-3 border-t dark:border-gray-700 pt-4">
              <p className="text-xs text-gray-400 dark:text-gray-500">Additional info (optional but recommended)</p>
              {EXTRA_FIELDS[selectedTemplate].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">{f.label}</label>
                  <input className={inp} placeholder={f.placeholder}
                    value={extraData[f.key] || ""}
                    onChange={(e) => setExtraData((p) => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
          )}

          {/* Custom template fields */}
          {selectedTemplate === "custom" && (
            <div className="mt-4 space-y-3 border-t dark:border-gray-700 pt-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Subject *</label>
                <input className={inp} placeholder="Email subject line" value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Body (HTML or plain text)</label>
                <textarea className={`${inp} h-36 resize-none font-mono text-xs`}
                  placeholder="<p>Hi {{name}}, ...</p> or plain text"
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* ── Recipients ──────────────────────────────────────────── */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-dark dark:text-gray-100 mb-3 flex items-center gap-2"><Users size={15} /> Recipients</h2>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setRecipientType("all")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm transition-colors ${
                recipientType === "all" ? "border-primary bg-primary/5 dark:bg-primary/10 font-medium" : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
              }`}
            >
              <Users size={14} /> All Customers
            </button>
            <button
              onClick={() => setRecipientType("selected")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm transition-colors ${
                recipientType === "selected" ? "border-primary bg-primary/5 dark:bg-primary/10 font-medium" : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
              }`}
            >
              <User size={14} /> Select Users
            </button>
          </div>

          {recipientType === "all" && (
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              📬 Email will be sent to <strong>all registered customers</strong> ({allUsers.length} users).
            </p>
          )}

          {recipientType === "selected" && (
            <div ref={dropRef} className="relative">
              {/* Selected chips */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedUsers.map((u) => (
                    <span key={u._id} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {u.name}
                      <button onClick={() => removeUser(u._id)}><X size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <input
                  className={inp}
                  placeholder="Search by name or email…"
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setShowUserDrop(true); }}
                  onFocus={() => setShowUserDrop(true)}
                />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {showUserDrop && filteredUsers.length > 0 && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border dark:border-gray-600 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredUsers.slice(0, 30).map((u) => (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => addUser(u)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
                    >
                      <span>
                        <span className="font-medium text-dark dark:text-gray-100">{u.name}</span>
                        <span className="text-gray-400 dark:text-gray-500 ml-2 text-xs">{u.email}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {selectedUsers.length > 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected</p>
              )}
            </div>
          )}
        </div>

        {/* ── Preview & Send ───────────────────────────────────────── */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-dark dark:text-gray-100 mb-3">Summary</h2>
          <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex gap-2">
              <span className="text-gray-400 w-24 flex-shrink-0">Template:</span>
              <span>{selectedTpl ? selectedTpl.subject : <span className="text-gray-300 dark:text-gray-600">Not selected</span>}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 w-24 flex-shrink-0">Recipients:</span>
              <span>{recipientType === "all" ? `All customers (${allUsers.length})` : `${selectedUsers.length} selected user${selectedUsers.length !== 1 ? "s" : ""}`}</span>
            </div>
          </div>

          {result && (
            <div className={`mt-4 flex items-center gap-2 text-sm rounded-lg px-3 py-2.5 ${result.failed === 0 ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"}`}>
              <Check size={15} />
              <span>Sent to <strong>{result.sent}</strong> of <strong>{result.total}</strong> users{result.failed > 0 ? ` (${result.failed} failed)` : ""}.</span>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={sending || !selectedTemplate}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {sending ? "Sending…" : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
