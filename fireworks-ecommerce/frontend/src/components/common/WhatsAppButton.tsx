const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const DEFAULT_MESSAGE = "Hi Eagle Crackers 👋, I have a question about your products.";

export default function WhatsAppButton() {
  if (!WHATSAPP_NUMBER) return null; // Not configured yet — hide instead of linking nowhere

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center
                 shadow-premium hover:scale-110 active:scale-95 transition-transform duration-200"
      style={{ background: "#25D366" }}
    >
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="#fff">
        <path d="M16.005 3C9.373 3 4 8.373 4 15.005c0 2.487.735 4.797 2 6.735L4.5 28.5l6.94-1.82a11.94 11.94 0 0 0 4.565.905h.005c6.632 0 12.005-5.373 12.005-12.005C28.015 8.373 22.642 3 16.005 3Zm7.02 17.02c-.297.836-1.47 1.53-2.32 1.71-.61.13-1.41.235-4.1-.88-3.44-1.42-5.66-4.9-5.83-5.13-.17-.23-1.39-1.85-1.39-3.53 0-1.68.88-2.5 1.19-2.85.31-.35.68-.44.91-.44.23 0 .46.005.66.015.21.01.5-.08.78.6.29.7.98 2.4 1.06 2.57.08.17.14.37.03.6-.11.23-.17.37-.34.57-.17.2-.36.44-.51.6-.17.17-.35.36-.15.7.2.34.9 1.49 1.94 2.42 1.34 1.19 2.46 1.56 2.8 1.73.34.17.54.14.74-.08.2-.22.85-1 1.08-1.34.23-.34.46-.28.77-.17.31.11 1.98.93 2.32 1.1.34.17.56.26.65.4.09.14.09.83-.2 1.66Z" />
      </svg>
    </a>
  );
}
