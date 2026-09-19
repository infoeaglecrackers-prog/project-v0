import { Phone } from "lucide-react";

// Falls back to the WhatsApp business number if a dedicated call number isn't configured.
const CALL_NUMBER = import.meta.env.VITE_CALL_NUMBER || import.meta.env.VITE_WHATSAPP_NUMBER;

export default function CallButton() {
  if (!CALL_NUMBER) return null; // Not configured yet — hide instead of linking nowhere

  return (
    <a
      href={`tel:+${CALL_NUMBER}`}
      aria-label="Call us"
      className="w-14 h-14 rounded-full flex items-center justify-center
                 shadow-premium hover:scale-110 active:scale-95 transition-transform duration-200
                 animate-shake-cta"
      style={{ background: "#c9184a" }}
    >
      <Phone size={24} className="text-white" fill="white" />
    </a>
  );
}
